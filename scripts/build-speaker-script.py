#!/usr/bin/env python3
"""
Build a practice-ready speaker script from the DDD Europe MDX deck.

Output: ~/Desktop/slides DDD/00-speaker-script.md

Different from build-slide-review.py: that one is a slide-by-slide
review with screenshots and raw speaker notes. THIS one is a flowing
script you can read aloud while rehearsing.

Each slide section has:
  - Slide index (zero-padded)
  - Title (from H2 or TitleCard)
  - "On screen:" cue (what the audience is looking at)
  - Speaker text (from <Notes>, cleaned up for practice)
  - Section breaks at each EXHIBIT badge

Usage:
  python3 scripts/build-speaker-script.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MDX_PATH = REPO_ROOT / "content" / "presentations" / "ddd-europe-talk.mdx"
OUT_PATH = Path.home() / "Desktop" / "slides DDD" / "00-speaker-script.md"

# Talk metadata for the doc header.
TALK_TITLE = "Reverse-Engineering DDD"
TALK_SUBTITLE = "Discovering Domains in Legacy Systems Without the Textbook"
TALK_EVENT = "DDD Europe 2026 — Antwerp"
TALK_DATE = "2026-06-10"
TALK_LENGTH_MIN = 50

# ── Slide parsing ────────────────────────────────────────────────────────


def split_slides(mdx_text: str) -> list[str]:
    """Drop YAML frontmatter, split body on \\n---\\n."""
    parts = mdx_text.split("\n---\n")
    return [chunk.strip() for chunk in parts[1:] if chunk.strip()]


H2_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
TITLECARD_RE = re.compile(r"<TitleCard\b([^>]*)>(.+?)</TitleCard>", re.DOTALL)
TITLECARD_BADGE_RE = re.compile(r'badge\s*=\s*"([^"]+)"')
TITLECARD_SUB_RE = re.compile(r'subtitle\s*=\s*"([^"]+)"')
SPEAKERCARD_NAME_RE = re.compile(r'<SpeakerCard\b[^>]*\bname\s*=\s*"([^"]+)"')
NOTES_RE = re.compile(r"<Notes>(.*?)</Notes>", re.DOTALL)


def extract_title_and_kind(slide: str) -> tuple[str, str]:
    """Return (title, kind) where kind is 'h2' | 'titlecard' | 'speaker' | 'other'.

    The kind drives the "On screen:" cue we generate for the section.
    """
    m = H2_RE.search(slide)
    if m:
        return m.group(1).strip(), "h2"

    m = TITLECARD_RE.search(slide)
    if m:
        attrs, body = m.group(1), m.group(2).strip()
        badge_m = TITLECARD_BADGE_RE.search(attrs)
        title = f"{badge_m.group(1).strip()} — {body}" if badge_m else body
        return title, "titlecard"

    m = SPEAKERCARD_NAME_RE.search(slide)
    if m:
        return f"Speaker — {m.group(1).strip()}", "speaker"

    return "(untitled)", "other"


def extract_notes(slide: str) -> str:
    """Pull the <Notes>...</Notes> body and tidy whitespace for reading."""
    m = NOTES_RE.search(slide)
    if not m:
        return ""
    text = m.group(1).strip()
    paragraphs = [
        re.sub(r"\s+", " ", p).strip()
        for p in re.split(r"\n\s*\n", text)
    ]
    return "\n\n".join(p for p in paragraphs if p)


# ── On-screen cue derivation ─────────────────────────────────────────────


SLIDE_COMPONENT_HINTS = [
    ("<BoundedContextMap", "Bounded Context Map — the evolving hypothesis diagram"),
    ("<TranslationMap", "Translation Map — the inter-context vocabulary table"),
    ("<EventCatalog", "Event Catalog — declared / fossilised / missing events"),
    ("<ContractYield", "Contract Yield — what the API contracts produced"),
    ("<HeatmapMatrix", "Heatmap matrix"),
    ("<ContradictionReveal", "Earlier-vs-later contradiction reveal"),
    ("<LineageTree", "Lineage tree"),
    ("<RankedBars", "Ranked bar chart"),
    ("<CompareTable", "Compare table"),
    ("<TicketCard", "Ticket card"),
    ("<CodeBlock", "Code snippet"),
    ("<SlideImage", "Image"),
    ("<BigStat", "Big-number stat"),
    ("<Callout", "Callout card"),
    ("<Split", "Two-column split"),
]


def extract_on_screen(slide: str, kind: str) -> str:
    """Best-effort one-line description of what the audience is looking at."""
    if kind == "titlecard":
        m = TITLECARD_SUB_RE.search(slide)
        sub = m.group(1).strip() if m else ""
        return f"Section title card — *{sub}*" if sub else "Section title card"
    if kind == "speaker":
        return "Your speaker bio card with QR code"

    hints: list[str] = []
    for token, label in SLIDE_COMPONENT_HINTS:
        if token in slide:
            hints.append(label)
    if hints:
        # Dedupe while preserving order.
        seen: set[str] = set()
        uniq = [h for h in hints if not (h in seen or seen.add(h))]
        return " · ".join(uniq)
    return "Title + body text"


# ── Section grouping ─────────────────────────────────────────────────────

EXHIBIT_BADGE_RE = re.compile(r'badge\s*=\s*"(EXHIBIT [A-G])"')


def section_for_slide(slide: str) -> str | None:
    """Return the EXHIBIT label if this slide is an exhibit divider, else None."""
    m = EXHIBIT_BADGE_RE.search(slide)
    return m.group(1) if m else None


# ── Output ───────────────────────────────────────────────────────────────


def render(slides: list[str]) -> str:
    lines: list[str] = []
    total = len(slides)
    avg_sec = (TALK_LENGTH_MIN * 60) // total

    lines.append(f"# {TALK_TITLE} — Speaker Script")
    lines.append("")
    lines.append(f"**Subtitle:** {TALK_SUBTITLE}")
    lines.append(f"**Event:** {TALK_EVENT}")
    lines.append(f"**Date:** {TALK_DATE}")
    lines.append(
        f"**Length:** {TALK_LENGTH_MIN} minutes · {total} slides · "
        f"~{avg_sec} sec/slide average"
    )
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## How to read this")
    lines.append("")
    lines.append(
        "Read aloud at presentation pace. Time yourself. Plain text is "
        "what you SAY. `[Square brackets]` are stage directions — do not "
        "read them. The *On screen* line tells you what the audience is "
        "looking at while you speak."
    )
    lines.append("")
    lines.append("---")
    lines.append("")

    # Walk slides and emit. When we hit an EXHIBIT title-card slide, we
    # also emit a big "## EXHIBIT X — …" section header just BEFORE it
    # so the practice document has visible chapter breaks.
    current_section: str | None = None
    for i, slide_text in enumerate(slides, start=1):
        section = section_for_slide(slide_text)
        if section and section != current_section:
            current_section = section
            lines.append("")
            lines.append(f"# {section}")
            lines.append("")

        title, kind = extract_title_and_kind(slide_text)
        on_screen = extract_on_screen(slide_text, kind)
        notes = extract_notes(slide_text)

        lines.append(f"### Slide {i:02d} · {title}")
        lines.append("")
        lines.append(f"*On screen — {on_screen}*")
        lines.append("")
        if notes:
            lines.append(notes)
        else:
            lines.append("_(No speaker notes yet for this slide.)_")
        lines.append("")
        lines.append("---")
        lines.append("")

    return "\n".join(lines)


def main() -> int:
    if not MDX_PATH.exists():
        print(f"missing MDX: {MDX_PATH}", file=sys.stderr)
        return 1
    if not OUT_PATH.parent.exists():
        print(f"missing output folder: {OUT_PATH.parent}", file=sys.stderr)
        return 1

    mdx_text = MDX_PATH.read_text(encoding="utf-8")
    slides = split_slides(mdx_text)
    doc = render(slides)
    OUT_PATH.write_text(doc, encoding="utf-8")
    print(f"wrote {OUT_PATH}  ({len(slides)} slides)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
