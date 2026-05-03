"""Orchestrator: parse → cluster → redact → typeset → write PDF.

Usage:
    python3 scripts/book/build_book.py

Outputs:
    dist/monologue-compilation-DRAFT.pdf
    attached_assets/monologue-compilation-DRAFT.pdf  (mirror)
    scripts/book/redaction.log                       (appended)
"""
from __future__ import annotations

import shutil
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from cluster import cluster_conversations  # noqa: E402
from parse import parse                     # noqa: E402
from redact import AuditLog, load_wordlist, redact_text  # noqa: E402
from typeset import build_pdf               # noqa: E402


SOURCE_JSON = ROOT / "attached_assets" / "conversations_1777770283870.json"
WORDLIST    = HERE / "redact_terms.txt"
AUDIT_LOG   = HERE / "redaction.log"
OUT_PDF     = ROOT / "dist" / "monologue-compilation-DRAFT.pdf"
MIRROR_PDF  = ROOT / "attached_assets" / "monologue-compilation-DRAFT.pdf"

N_CLUSTERS    = 12
PER_CHAPTER   = 5
EXCERPT_CHARS = 9000   # per-thread cap to keep the PDF manageable
MIN_CHARS     = 600    # drop tiny one-liner conversations from clustering


def main() -> int:
    t0 = time.time()
    print(f"[book] reading {SOURCE_JSON.name}")
    if not SOURCE_JSON.exists():
        print(f"[book] FATAL: source JSON not found at {SOURCE_JSON}", file=sys.stderr)
        return 2
    convs = parse(SOURCE_JSON)
    print(f"[book] parsed {len(convs):,} conversations  "
          f"({sum(c.message_count for c in convs):,} turns)")

    terms = load_wordlist(WORDLIST)
    print(f"[book] loaded {len(terms)} wordlist term(s) from {WORDLIST.name}")

    log = AuditLog(AUDIT_LOG)

    # Pre-redaction filter: drop any conversation whose title or body still
    # contains a [REDACTED — PRE-FILING] marker AFTER redaction. This is a
    # belt-and-suspenders guard for the patent material — those threads are
    # excluded from the book entirely, not merely masked.
    PREFILING_MARKER = "[REDACTED — PRE-FILING]"

    cleaned = []
    dropped_prefiling = 0
    for c in convs:
        c.title = redact_text(c.title, c.id, terms, log)
        if PREFILING_MARKER in c.title:
            dropped_prefiling += 1
            continue
        new_turns = []
        skip = False
        for t in c.turns:
            t.text = redact_text(t.text, c.id, terms, log)
            if PREFILING_MARKER in t.text:
                skip = True
                break
            new_turns.append(t)
        if skip:
            dropped_prefiling += 1
            continue
        c.turns = new_turns
        cleaned.append(c)
    print(f"[book] redaction: {log.total} replacements  "
          f"(dropped {dropped_prefiling} conversation(s) flagged pre-filing)")

    print(f"[book] clustering into ~{N_CLUSTERS} chapters …")
    chapters = cluster_conversations(
        cleaned,
        n_clusters=N_CLUSTERS,
        per_chapter=PER_CHAPTER,
        min_chars=MIN_CHARS,
    )
    print(f"[book] produced {len(chapters)} chapters:")
    for i, ch in enumerate(chapters, 1):
        print(f"        {i:2d}. {ch.title:40s}  "
              f"({ch.date_range[0]}–{ch.date_range[1]})  "
              f"n={len(ch.conversations)}")

    OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    print(f"[book] typesetting → {OUT_PDF}")
    # Compute real cover stats from the original (un-dropped) parsed export
    # so the title page never drifts from what was actually processed.
    period = (
        f"{convs[0].created.strftime('%B %Y')} – "
        f"{convs[-1].created.strftime('%B %Y')}"
    ) if convs else ""
    stats = {
        "conversations": len(convs),
        "messages": sum(c.message_count for c in convs),
        "period": period,
    }
    build_pdf(chapters, OUT_PDF, excerpt_chars=EXCERPT_CHARS, stats=stats)
    shutil.copy2(OUT_PDF, MIRROR_PDF)
    log.write()

    size_kb = OUT_PDF.stat().st_size / 1024
    print(f"[book] done in {time.time() - t0:0.1f}s  "
          f"({size_kb:0.1f} KB)  audit log: {AUDIT_LOG}")
    print(f"[book] mirror copy: {MIRROR_PDF}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
