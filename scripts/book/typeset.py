"""Typeset a list of Chapter objects into a cyanotype-blue PDF.

Style invariants (from the portfolio site):
  - Cyanotype blue:  #1d4dba
  - Mono typeface:   JetBrains Mono (regular / bold / italic)
  - Square corners, dashed rules, ALL-CAPS mono headings
  - Light theme: ink on archival cream
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, NextPageTemplate, PageBreak, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)

# --- Brand tokens -------------------------------------------------------------
CYANOTYPE = colors.HexColor("#1d4dba")
INK = colors.HexColor("#0e1a2b")
DIM = colors.HexColor("#5a6e8c")
CREAM = colors.HexColor("#f5f1e6")
RULE = colors.HexColor("#1d4dba")

FONTS_DIR = Path(__file__).parent / "fonts"


def _register_fonts() -> tuple[str, str, str]:
    base = "JetBrainsMono"
    pdfmetrics.registerFont(TTFont(f"{base}-Regular", str(FONTS_DIR / "JetBrainsMono-Regular.ttf")))
    pdfmetrics.registerFont(TTFont(f"{base}-Bold",    str(FONTS_DIR / "JetBrainsMono-Bold.ttf")))
    pdfmetrics.registerFont(TTFont(f"{base}-Italic",  str(FONTS_DIR / "JetBrainsMono-Italic.ttf")))
    return f"{base}-Regular", f"{base}-Bold", f"{base}-Italic"


def _styles(reg: str, bold: str, ital: str) -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()["Normal"]
    return {
        "body": ParagraphStyle(
            "body", parent=base, fontName=reg, fontSize=9.5, leading=14,
            textColor=INK, alignment=TA_JUSTIFY, spaceAfter=8,
        ),
        "body_first": ParagraphStyle(
            "body_first", parent=base, fontName=reg, fontSize=9.5, leading=14,
            textColor=INK, alignment=TA_JUSTIFY, spaceAfter=8, firstLineIndent=0,
        ),
        "section_title": ParagraphStyle(
            "section_title", parent=base, fontName=bold, fontSize=11, leading=14,
            textColor=CYANOTYPE, alignment=TA_LEFT, spaceBefore=18, spaceAfter=2,
        ),
        "section_meta": ParagraphStyle(
            "section_meta", parent=base, fontName=ital, fontSize=8, leading=11,
            textColor=DIM, alignment=TA_LEFT, spaceAfter=10,
        ),
        "chapter_kicker": ParagraphStyle(
            "chapter_kicker", parent=base, fontName=reg, fontSize=8, leading=11,
            textColor=DIM, alignment=TA_LEFT, spaceAfter=4,
        ),
        "chapter_title": ParagraphStyle(
            "chapter_title", parent=base, fontName=bold, fontSize=22, leading=26,
            textColor=CYANOTYPE, alignment=TA_LEFT, spaceAfter=6,
        ),
        "chapter_keywords": ParagraphStyle(
            "chapter_keywords", parent=base, fontName=ital, fontSize=8.5, leading=12,
            textColor=DIM, alignment=TA_LEFT, spaceAfter=22,
        ),
        "cover_title": ParagraphStyle(
            "cover_title", parent=base, fontName=bold, fontSize=36, leading=42,
            textColor=CYANOTYPE, alignment=TA_LEFT, spaceAfter=10,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub", parent=base, fontName=reg, fontSize=11, leading=16,
            textColor=INK, alignment=TA_LEFT, spaceAfter=4,
        ),
        "cover_meta": ParagraphStyle(
            "cover_meta", parent=base, fontName=reg, fontSize=8.5, leading=12,
            textColor=DIM, alignment=TA_LEFT,
        ),
        "epigraph": ParagraphStyle(
            "epigraph", parent=base, fontName=ital, fontSize=10, leading=15,
            textColor=INK, alignment=TA_LEFT, leftIndent=24, rightIndent=24,
        ),
        "toc_row": ParagraphStyle(
            "toc_row", parent=base, fontName=reg, fontSize=10, leading=15,
            textColor=INK, alignment=TA_LEFT,
        ),
        "frontmatter_h": ParagraphStyle(
            "frontmatter_h", parent=base, fontName=bold, fontSize=10, leading=14,
            textColor=CYANOTYPE, alignment=TA_LEFT, spaceAfter=12,
        ),
        "footer": ParagraphStyle(
            "footer", parent=base, fontName=reg, fontSize=7.5, leading=10,
            textColor=DIM, alignment=TA_LEFT,
        ),
    }


# --- Doc + page templates ----------------------------------------------------
class BookDoc(BaseDocTemplate):
    def __init__(self, filename: str, **kw):
        super().__init__(
            filename, pagesize=LETTER,
            leftMargin=0.95 * inch, rightMargin=0.95 * inch,
            topMargin=0.85 * inch, bottomMargin=0.85 * inch,
            title=kw.pop("title", "Monologue Compilation"),
            author=kw.pop("author", "Jacob C. Smith"),
        )
        self.book_title = kw.pop("book_title", "MONOLOGUE COMPILATION")
        self._chapter_label = ""
        self._page_no = 0

        frame = Frame(
            self.leftMargin, self.bottomMargin,
            self.width, self.height, id="body",
            leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        )
        cover_frame = Frame(
            self.leftMargin, self.bottomMargin,
            self.width, self.height, id="cover",
            leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
        )
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[cover_frame], onPage=self._draw_cover_chrome),
            PageTemplate(id="body", frames=[frame], onPage=self._draw_chrome),
        ])

    def afterFlowable(self, flowable):
        # Track current chapter label for running header.
        if hasattr(flowable, "_chapter_label"):
            self._chapter_label = flowable._chapter_label

    def _draw_cover_chrome(self, canvas, doc):
        canvas.saveState()
        # Cyanotype band on the left edge.
        canvas.setFillColor(CYANOTYPE)
        canvas.rect(0, 0, 0.4 * inch, LETTER[1], fill=1, stroke=0)
        canvas.restoreState()

    def _draw_chrome(self, canvas, doc):
        canvas.saveState()
        w, h = LETTER
        # Top dashed rule
        canvas.setStrokeColor(RULE)
        canvas.setDash(2, 2)
        canvas.setLineWidth(0.5)
        canvas.line(self.leftMargin, h - self.topMargin + 14,
                    w - self.rightMargin, h - self.topMargin + 14)
        # Bottom dashed rule
        canvas.line(self.leftMargin, self.bottomMargin - 14,
                    w - self.rightMargin, self.bottomMargin - 14)
        canvas.setDash()

        # Header: book title on left, chapter label on right (small caps)
        canvas.setFont("JetBrainsMono-Regular", 7.5)
        canvas.setFillColor(DIM)
        canvas.drawString(self.leftMargin, h - self.topMargin + 20,
                          self.book_title.upper())
        if self._chapter_label:
            canvas.drawRightString(w - self.rightMargin, h - self.topMargin + 20,
                                   self._chapter_label.upper())
        # Footer: page number right, signature left
        canvas.drawString(self.leftMargin, self.bottomMargin - 24,
                          "JACOB C. SMITH · MONOLOGUE COMPILATION · DRAFT")
        canvas.drawRightString(w - self.rightMargin, self.bottomMargin - 24,
                               f"{doc.page:03d}")
        canvas.restoreState()


# --- Helpers ------------------------------------------------------------------
def _esc(s: str) -> str:
    return (s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;"))


def _paragraphs(text: str, style: ParagraphStyle) -> list:
    out = []
    for raw in text.split("\n\n"):
        raw = raw.strip()
        if not raw:
            continue
        # Convert internal single newlines to <br/> to preserve poem-like form.
        body = _esc(raw).replace("\n", "<br/>")
        out.append(Paragraph(body, style))
    return out


class _ChapterMarker(Spacer):
    """Invisible spacer that sets the running header label."""
    def __init__(self, label: str):
        super().__init__(1, 0.01)
        self._chapter_label = label


# --- Public: build the PDF ---------------------------------------------------
def build_pdf(
    chapters: list,                       # list[cluster.Chapter]
    output_path: Path,
    book_title: str = "MONOLOGUE COMPILATION",
    subtitle: str = "An auto-curated reader of one human–machine continuous voice",
    excerpt_chars: int = 9000,
    stats: dict | None = None,            # {"conversations": int, "messages": int, "period": str}
) -> Path:
    reg, bold, ital = _register_fonts()
    S = _styles(reg, bold, ital)

    doc = BookDoc(str(output_path), title=book_title, book_title=book_title)
    story = []

    # ---- COVER ----
    story.append(Spacer(1, 1.6 * inch))
    story.append(Paragraph(book_title, S["cover_title"]))
    story.append(Paragraph(subtitle, S["cover_sub"]))
    story.append(Spacer(1, 0.4 * inch))
    story.append(Paragraph("Jacob C. Smith", S["cover_sub"]))
    story.append(Spacer(1, 2.6 * inch))
    story.append(Paragraph(
        f"Volume i · DRAFT · {datetime.now(tz=timezone.utc).strftime('%B %Y')}",
        S["cover_meta"],
    ))
    s = stats or {}
    n_conv = s.get("conversations", 0)
    n_msg  = s.get("messages", 0)
    period = s.get("period", "July 2023 – March 2025")
    story.append(Paragraph(
        f"Compiled from {n_conv:,} conversations · {n_msg:,} messages · {period}",
        S["cover_meta"],
    ))
    story.append(Paragraph(
        "Voice: blended (user + assistant turns merged into one continuous "
        "stream, in chronological order, no role labels).",
        S["cover_meta"],
    ))
    story.append(NextPageTemplate("body"))
    story.append(PageBreak())

    # ---- COLOPHON / NOTE ----
    story.append(Paragraph("ABOUT THIS VOLUME", S["frontmatter_h"]))
    story.append(Paragraph(
        "This book was assembled by an automated typesetting pipeline. "
        "Conversations were grouped into themed chapters by TF-IDF + KMeans "
        "clustering on the entire export, then the most substantial threads "
        "in each cluster were chosen by an engagement score (length, balance, "
        "and user contribution).",
        S["body"],
    ))
    story.append(Paragraph(
        "Each thread is reproduced as a single continuous voice: the "
        "alternating turns are concatenated in order, without role labels, "
        "so the prose reads as one mind speaking. A light redaction pass "
        "removes emails, URL tokens, API-key-shaped strings, and a "
        "configurable wordlist; an audit log is written alongside the PDF.",
        S["body"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "&#8220;Speech is silver, silence is golden — but the river of one's "
        "own thinking, written down, is the cheapest mineral of all and the "
        "easiest to mistake for either.&#8221;",
        S["epigraph"],
    ))
    story.append(PageBreak())

    # ---- TABLE OF CONTENTS ----
    story.append(Paragraph("CONTENTS", S["frontmatter_h"]))
    toc_rows = [["Ch.", "Title", "Period", "Threads"]]
    for i, ch in enumerate(chapters, 1):
        toc_rows.append([
            f"{i:02d}",
            ch.title,
            f"{ch.date_range[0]} – {ch.date_range[1]}",
            str(len(ch.conversations)),
        ])
    toc = Table(toc_rows, colWidths=[0.5 * inch, 3.3 * inch, 1.7 * inch, 0.7 * inch])
    toc.setStyle(TableStyle([
        ("FONT", (0, 0), (-1, 0), bold, 8.5),
        ("FONT", (0, 1), (-1, -1), reg, 9.5),
        ("TEXTCOLOR", (0, 0), (-1, 0), CYANOTYPE),
        ("TEXTCOLOR", (0, 1), (-1, -1), INK),
        ("LINEBELOW", (0, 0), (-1, 0), 0.5, CYANOTYPE),
        ("LINEBELOW", (0, 1), (-1, -1), 0.25, DIM),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("ALIGN", (0, 0), (0, -1), "LEFT"),
        ("ALIGN", (3, 0), (3, -1), "RIGHT"),
    ]))
    story.append(toc)
    story.append(PageBreak())

    # ---- CHAPTERS ----
    for i, ch in enumerate(chapters, 1):
        story.append(_ChapterMarker(f"Ch. {i:02d} · {ch.title}"))
        story.append(Paragraph(f"CHAPTER {i:02d}", S["chapter_kicker"]))
        # Style invariant: chapter titles are ALL-CAPS mono.
        story.append(Paragraph(_esc(ch.title.upper()), S["chapter_title"]))
        kw = " · ".join(k for k in ch.keywords[:6] if k)
        story.append(Paragraph(
            f"{ch.date_range[0]} – {ch.date_range[1]}  /  keywords: {_esc(kw)}",
            S["chapter_keywords"],
        ))

        for j, conv in enumerate(ch.conversations, 1):
            date = conv.created.strftime("%Y · %b %d")
            story.append(Paragraph(_esc(conv.title), S["section_title"]))
            story.append(Paragraph(
                f"{date}  ·  {conv.message_count} turns  ·  "
                f"{conv.char_count:,} characters",
                S["section_meta"],
            ))
            text = conv.blended_text
            if len(text) > excerpt_chars:
                text = text[:excerpt_chars].rsplit(" ", 1)[0] + " […]"
            story.extend(_paragraphs(text, S["body"]))

        if i < len(chapters):
            story.append(PageBreak())

    doc.build(story)
    return output_path
