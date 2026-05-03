# Monologue Compilation Book — pipeline

A Python pipeline that turns Jacob's full ChatGPT export into a typeset
PDF book. One command produces a draft:

```bash
npm run build:book
```

…which writes:

- `dist/monologue-compilation-DRAFT.pdf` — the book
- `attached_assets/monologue-compilation-DRAFT.pdf` — mirror copy for review
- `scripts/book/redaction.log` — append-only audit log of every replacement

## Pipeline

| Stage    | File                | What it does |
| -------- | ------------------- | ------------ |
| parse    | `parse.py`          | Walks the OpenAI export `mapping` tree per conversation, in chronological order. Keeps only `user` + `assistant` text turns; drops `system`, `tool`, hidden, and empty messages. |
| redact   | `redact.py`         | Applies, in order: email regex, URL-with-token regex, sensitive-token regexes (sk-, ghp_, AKIA, JWT, …), then a configurable wordlist (`redact_terms.txt`). Writes a JSONL audit log. |
| cluster  | `cluster.py`        | TF-IDF (1-grams, custom stopword list including conversational and code filler) + KMeans into `N_CLUSTERS=12` themed chapters. Each cluster is auto-named via a curated theme map with a fallback to its top discriminative TF-IDF terms. Within a chapter, conversations are scored by length × balance × engagement, and the top `PER_CHAPTER=5` are selected and ordered chronologically. |
| typeset  | `typeset.py`        | ReportLab Platypus → letter-size PDF. JetBrains Mono throughout, cyanotype-blue (`#1d4dba`) accents, square corners, dashed top/bottom rules, ALL-CAPS mono running headers, page numbers. |
| orchestrate | `build_book.py`  | Glues it all together, prints a chapter manifest, writes the PDF + mirror + audit log. |

## Voice — blended

Every thread is reproduced as **one continuous voice**: the alternating
turns are concatenated in order, paragraph-per-turn, with **no role
labels**. The user's prompts and the assistant's replies are merged into a
single stream. This is intentional: the book is meant to read as one mind
speaking to itself across two years.

## Redaction

`redact_terms.txt` is a plain wordlist, one term per line:

```
# comments are ignored
hysteretic computing -> [REDACTED — PRE-FILING]
Squire on Main      -> regional hospitality client
plain term                # → [REDACTED] by default
```

Conversations whose title or body contain the pre-filing marker
`[REDACTED — PRE-FILING]` after redaction are **dropped from the book
entirely** — not merely masked — as a second guard for the patent
material.

The audit log (`redaction.log`) is JSON-lines, appended on every run, so
two builds can be diffed.

## Configuration

Top-of-file constants in `build_book.py`:

| Const             | Default | Notes |
| ----------------- | ------: | ----- |
| `N_CLUSTERS`      |     12  | target chapter count |
| `PER_CHAPTER`     |      5  | threads selected per chapter |
| `EXCERPT_CHARS`   |   9000  | per-thread cap (truncated mid-word with `[…]`) |
| `MIN_CHARS`       |    600  | drop tiny one-liner threads from clustering pool |

## Fonts

JetBrains Mono (Regular / Bold / Italic) is bundled in `scripts/book/fonts/`.
The TTFs ship with the repo so the build is deterministic offline.

## Requirements

Python ≥ 3.11. Install dependencies with:

```bash
pip install -r scripts/book/requirements.txt
```

Pinned in `scripts/book/requirements.txt`: `scikit-learn`, `nltk`,
`reportlab`, `pillow`, `numpy`. The same set is mirrored in the
top-level `pyproject.toml` so Replit's package manager can resolve
the Python toolchain automatically.

## Reviewing the redaction audit

Two audit logs are produced on every build, both under `scripts/book/`
(a source directory — never deployed):

- `scripts/book/redaction.log` — **append-only history**: every run is
  concatenated. Useful for tracking redaction drift over time.
- `scripts/book/redaction_runs/redaction-<UTC-timestamp>.log` — **fresh,
  single-run** snapshot containing only the replacements made by the
  most recent build. **Reviewers should default to this file** when
  spot-checking a build. The newest 10 runs are kept; older snapshots
  rotate out automatically.

Snippets in the logs always replace the matched span with a safe
`‹REDACTED:N›` placeholder (where N is the matched length) so the audit
itself never re-leaks the very PII or secrets the redactor just removed.
Surrounding context (~24 chars) is also scrubbed for incidental email-
or opaque-token-shaped runs.

## Intermediate outputs (PRIVATE — never deployed)

Before the PDF is built, the orchestrator writes private intermediates
under `.local/book/` (outside the Vite build, never copied to `dist/`,
never published):

- `.local/book/chapters/NN-slug.md` — one markdown file per chapter,
  full blended-voice text of every selected conversation. Use these
  to diff two builds, hand a chapter to a copy editor, or re-typeset
  with another tool later.
- `.local/book/manifest.json` — machine-readable index of which
  threads were placed in which chapter, with cluster keywords and
  per-thread metadata.
- `.local/book/conversations.normalized.json` — every KEPT conversation
  (post-redaction, pre-filing-dropped threads excluded) in normalized
  form, for end-to-end pipeline traceability.

The ONLY book-pipeline outputs that are allowed in deployed paths
(`dist/`, `attached_assets/`) are the PDF itself and its mirror copy.

## Status

Draft pipeline. The PDF is **not** linked from the site nav and should
not be published until Jacob has reviewed the output and approved it.
The optional `/book` SPA reader (stretch goal) is intentionally not
built in this pass.
