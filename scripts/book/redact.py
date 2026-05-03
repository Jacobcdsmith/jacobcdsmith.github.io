"""Light redaction pass + audit log.

Applies, in order:
  1. Email addresses              -> [REDACTED — EMAIL]
  2. URLs with auth/token params  -> scheme://host/[REDACTED — URL TOKEN]
  3. Sensitive token patterns     -> [REDACTED — TOKEN]
     (sk-..., ghp_..., AKIA..., AWS secret-style, JWT-looking strings)
  4. Wordlist file                -> per-term replacement with audit log

Audit log is appended-to (newline-delimited JSON) so multiple builds can be
diffed.
"""
from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


# --- Regex patterns -----------------------------------------------------------
EMAIL_RE = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")
URL_TOKEN_RE = re.compile(
    r"(https?://[^\s)\]]+?)[?&](?:token|key|api[_-]?key|access[_-]?token|auth|"
    r"sig|signature|secret|password|sessionid)=[^\s)&]+",
    re.IGNORECASE,
)
TOKEN_PATTERNS = [
    re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),                # OpenAI-ish
    re.compile(r"\bghp_[A-Za-z0-9]{20,}\b"),                 # GitHub PAT
    re.compile(r"\bgithub_pat_[A-Za-z0-9_]{30,}\b"),         # GitHub fine-grained
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),                     # AWS access key id
    re.compile(r"\b[A-Za-z0-9/+]{40}\b(?=\s*(?:secret|aws))", re.IGNORECASE),
    re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"),  # JWT
    # Generic opaque-blob heuristics. Long hex (>= 32 chars) catches MD5,
    # SHA-1, SHA-256, commit hashes, signed-URL signatures, hex-encoded
    # secrets, etc. Long mixed base64-ish runs (>= 40 chars containing at
    # least one digit AND at least one letter, no whitespace) catch most
    # opaque tokens that don't fit a named family above.
    re.compile(r"\b[a-fA-F0-9]{32,}\b"),
    re.compile(r"(?<![A-Za-z0-9_+/=-])"
               r"(?=[A-Za-z0-9+/_=-]*[A-Za-z])"
               r"(?=[A-Za-z0-9+/_=-]*[0-9])"
               r"[A-Za-z0-9+/_=-]{40,}"
               r"(?![A-Za-z0-9_+/=-])"),
]


# --- Wordlist -----------------------------------------------------------------
@dataclass
class Term:
    pattern: re.Pattern[str]
    raw: str
    replacement: str


def load_wordlist(path: Path) -> list[Term]:
    terms: list[Term] = []
    if not path.exists():
        return terms
    for line in path.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if "->" in s:
            left, right = (p.strip() for p in s.split("->", 1))
        else:
            left, right = s, "[REDACTED]"
        if not left:
            continue
        pat = re.compile(r"\b" + re.escape(left) + r"\b", re.IGNORECASE)
        terms.append(Term(pattern=pat, raw=left, replacement=right))
    # Sort longest-first so multi-word phrases match before sub-words.
    terms.sort(key=lambda t: -len(t.raw))
    return terms


# --- Audit log ----------------------------------------------------------------
class AuditLog:
    def __init__(self, path: Path):
        self.path = path
        self._records: list[dict] = []

    def add(
        self,
        conv_id: str,
        kind: str,
        term: str,
        count: int,
        snippets: list[str] | None = None,
    ) -> None:
        if count <= 0:
            return
        rec: dict = {
            "conv_id": conv_id,
            "kind": kind,
            "term": term,
            "count": count,
        }
        if snippets:
            # Cap to a few short snippets so the log stays reviewable.
            rec["snippets"] = [s[:140] for s in snippets[:3]]
        self._records.append(rec)

    def write(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        ts = datetime.now(tz=timezone.utc).isoformat()
        header = {
            "_run_at": ts,
            "_total_records": len(self._records),
            "_total_replacements": sum(r["count"] for r in self._records),
        }
        with self.path.open("a", encoding="utf-8") as f:
            f.write(json.dumps({"_header": header}) + "\n")
            for r in self._records:
                f.write(json.dumps(r) + "\n")
            f.write("\n")

    @property
    def total(self) -> int:
        return sum(r["count"] for r in self._records)


# --- Public API ---------------------------------------------------------------
def _snippets_for(pattern: re.Pattern[str], text: str, ctx: int = 24) -> list[str]:
    """Return up to a few `…before‹REDACTED:N›after…` context strings.

    The matched span is REPLACED with a safe placeholder so the audit log
    never re-leaks the very PII / secret the redactor just removed from the
    PDF. Only the surrounding ~24 chars of context survive, and they pass
    through `_scrub_context` to strip anything that itself looks like a
    secret (e.g. neighbouring emails / tokens that haven't been redacted
    by *this particular* pattern yet).
    """
    snips: list[str] = []
    for m in pattern.finditer(text):
        a = max(0, m.start() - ctx)
        b = min(len(text), m.end() + ctx)
        before = _scrub_context(text[a:m.start()].replace("\n", " "))
        after  = _scrub_context(text[m.end():b].replace("\n", " "))
        snips.append(f"…{before}‹REDACTED:{len(m.group(0))}›{after}…")
        if len(snips) >= 3:
            break
    return snips


_CONTEXT_SCRUBBERS = (
    EMAIL_RE,
    re.compile(r"[A-Za-z0-9+/_=-]{16,}"),  # any longish opaque run
)


def _scrub_context(s: str) -> str:
    """Mask anything in the surrounding context that itself looks sensitive."""
    out = s
    for pat in _CONTEXT_SCRUBBERS:
        out = pat.sub("‹*›", out)
    return out


def redact_text(text: str, conv_id: str, terms: Iterable[Term], log: AuditLog) -> str:
    out = text

    def _sub(pattern: re.Pattern[str], repl: str, kind: str, label: str) -> None:
        nonlocal out
        snips = _snippets_for(pattern, out)
        new, n = pattern.subn(repl, out)
        if n:
            log.add(conv_id, kind, label, n, snippets=snips)
            out = new

    _sub(EMAIL_RE, "[redacted email]", "email", "<email>")
    _sub(URL_TOKEN_RE, "[redacted url]", "url_token", "<url_token>")
    for i, pat in enumerate(TOKEN_PATTERNS):
        _sub(pat, "[redacted key]", "token", f"<token_pattern_{i}>")
    for t in terms:
        snips = _snippets_for(t.pattern, out)
        new, n = t.pattern.subn(t.replacement, out)
        if n:
            log.add(conv_id, "wordlist", t.raw, n, snippets=snips)
            out = new
    return out


if __name__ == "__main__":
    import sys
    sample = sys.argv[1] if len(sys.argv) > 1 else (
        "Email me at jacob@example.com or hit https://api.example.com/v1?token=abcd1234. "
        "My key is sk-AbCdEfGhIjKlMnOpQrStUvWxYz1234567890. "
        "Squire on Main is great. Talked about hysteretic computing too."
    )
    terms = load_wordlist(Path("scripts/book/redact_terms.txt"))
    log = AuditLog(Path("scripts/book/redaction.log"))
    out = redact_text(sample, "demo", terms, log)
    print(out)
    print(f"\n[{log.total} replacements]")
