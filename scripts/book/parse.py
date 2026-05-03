"""Parse OpenAI ChatGPT export `conversations.json` into clean records.

Walks the `mapping` tree from the conversation's root via parent->children
links, ordered by create_time, extracting only user + assistant text turns.
System / tool / hidden messages are dropped. Empty-content nodes are skipped.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


@dataclass
class Turn:
    role: str         # "user" or "assistant"
    text: str
    ts: float | None  # unix seconds, may be None


@dataclass
class Conversation:
    id: str
    title: str
    create_time: float
    update_time: float
    turns: list[Turn] = field(default_factory=list)

    @property
    def created(self) -> datetime:
        return datetime.fromtimestamp(self.create_time, tz=timezone.utc)

    @property
    def message_count(self) -> int:
        return len(self.turns)

    @property
    def user_count(self) -> int:
        return sum(1 for t in self.turns if t.role == "user")

    @property
    def char_count(self) -> int:
        return sum(len(t.text) for t in self.turns)

    @property
    def blended_text(self) -> str:
        """Continuous prose: each turn as a paragraph, no role labels."""
        return "\n\n".join(t.text.strip() for t in self.turns if t.text.strip())


_BINARY_MARKERS = (
    "\x89PNG", "\u2030PNG",  # PNG magic (raw + mojibake-decoded)
    "IHDR", "IDAT", "IEND",
    "JFIF", "Exif",
    "%PDF-", "%%EOF",
    "PK\x03\x04",                 # ZIP / docx / xlsx
    "GIF87a", "GIF89a",
    "RIFF",
    "ftypmp4", "ftypisom",
    "data:image/", "data:application/",
)


def _looks_binary(text: str) -> bool:
    """Heuristic: is this turn a raw asset blob the typesetter must skip?"""
    if not text:
        return False
    head = text[:600]
    if any(m in head for m in _BINARY_MARKERS):
        return True
    if any(m in text for m in _BINARY_MARKERS):
        return True
    # Long run of non-printable / control chars => almost certainly binary.
    nonprint = sum(1 for ch in head if not (ch.isprintable() or ch in "\n\r\t "))
    if len(head) >= 200 and nonprint / len(head) > 0.20:
        return True
    # Pathologically long lines without spaces are almost always blob payloads
    # (base64 attachments, dumped binary, etc.) and have no editorial value.
    longest = max((len(line) for line in text.splitlines()), default=0)
    if longest > 4000:
        return True
    return False


def _extract_parts(msg: dict[str, Any]) -> str:
    if not msg:
        return ""
    content = msg.get("content") or {}
    ctype = content.get("content_type")
    parts = content.get("parts") or []
    if ctype != "text":
        return ""
    out = []
    for p in parts:
        if isinstance(p, str):
            out.append(p)
        elif isinstance(p, dict):
            txt = p.get("text") or ""
            if txt:
                out.append(txt)
    return "\n".join(out).strip()


def _walk(mapping: dict[str, Any]) -> list[dict[str, Any]]:
    """Return a chronologically-ordered list of message nodes."""
    roots = [nid for nid, n in mapping.items() if not n.get("parent")]
    ordered: list[dict[str, Any]] = []
    seen: set[str] = set()

    def visit(nid: str) -> None:
        if nid in seen or nid not in mapping:
            return
        seen.add(nid)
        node = mapping[nid]
        ordered.append(node)
        children = list(node.get("children") or [])
        # Order siblings by create_time (stable on missing).
        def ckey(cid: str) -> float:
            cn = mapping.get(cid) or {}
            cm = (cn.get("message") or {}) or {}
            return cm.get("create_time") or 0.0
        children.sort(key=ckey)
        for c in children:
            visit(c)

    for r in roots:
        visit(r)
    return ordered


def parse(json_path: Path) -> list[Conversation]:
    raw = json.loads(json_path.read_text(encoding="utf-8"))
    convs: list[Conversation] = []
    for c in raw:
        mapping = c.get("mapping") or {}
        ordered = _walk(mapping)
        turns: list[Turn] = []
        for node in ordered:
            msg = node.get("message") or {}
            if not msg:
                continue
            md = msg.get("metadata") or {}
            if md.get("is_visually_hidden_from_conversation"):
                continue
            author = (msg.get("author") or {}).get("role")
            if author not in ("user", "assistant"):
                continue
            text = _extract_parts(msg)
            if not text:
                continue
            if _looks_binary(text):
                # Replace the entire turn with a short editorial marker so
                # the prose around it still reads naturally and the
                # typesetter never emits raw asset bytes.
                text = "[attachment omitted — binary payload]"
            turns.append(Turn(role=author, text=text, ts=msg.get("create_time")))
        if not turns:
            continue
        # Enforce strict chronological order. The mapping tree is a DAG with
        # branches (regenerations / edits), so DFS-pre-order over the tree
        # can emit descendants before later sibling branches with earlier
        # timestamps. Sort by `ts`, filling missing values by carrying the
        # previous known ts forward so newly-orphaned nodes stay near their
        # neighbors. Python's sort is stable, preserving walk order for ties.
        last = 0.0
        for t in turns:
            if t.ts is None or t.ts == 0:
                t.ts = last
            else:
                last = t.ts
        turns.sort(key=lambda t: t.ts or 0.0)
        convs.append(Conversation(
            id=c.get("conversation_id") or c.get("id") or "",
            title=(c.get("title") or "Untitled").strip() or "Untitled",
            create_time=c.get("create_time") or 0.0,
            update_time=c.get("update_time") or 0.0,
            turns=turns,
        ))
    convs.sort(key=lambda x: x.create_time)
    return convs


def to_jsonable(convs: list[Conversation]) -> list[dict[str, Any]]:
    return [asdict(c) for c in convs]


if __name__ == "__main__":
    import sys
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("attached_assets/conversations_1777770283870.json")
    cs = parse(src)
    print(f"Parsed {len(cs)} conversations, "
          f"{sum(c.message_count for c in cs):,} turns, "
          f"{sum(c.char_count for c in cs):,} chars")
