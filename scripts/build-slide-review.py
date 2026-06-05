#!/usr/bin/env python3
"""
Build two Markdown review docs for the DDD Europe talk deck.

Inputs:
  - The deck MDX:       content/presentations/ddd-europe-talk.mdx
  - Slide screenshots:  ~/Desktop/slides DDD/*.png  (sorted chronologically)

Outputs (written into the screenshots folder so image refs are relative):
  - 00-slides-images.md   image + title per slide      (for visual review)
  - 00-slides-script.md   title + speaker notes        (for verbal review)

The two docs can be reviewed side-by-side (in VS Code preview or pasted
into Perplexity / Claude) to suggest cuts, trims, and reorderings.

Usage:
  python3 scripts/build-slide-review.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import quote

REPO_ROOT = Path(__file__).resolve().parent.parent
MDX_PATH = REPO_ROOT / "content" / "presentations" / "ddd-europe-talk.mdx"
SCREENSHOTS_DIR = Path.home() / "Desktop" / "slides DDD"

IMAGES_OUT = SCREENSHOTS_DIR / "00-slides-images.md"
SCRIPT_OUT = SCREENSHOTS_DIR / "00-slides-script.md"


def split_slides(mdx_text: str) -> list[str]:
    """Strip the YAML frontmatter and split the remaining body on '\\n---\\n'.

    The MDX file starts with '---\\n<yaml>\\n---\\n' and uses '\\n---\\n'
    between slides. After dropping the frontmatter, splitting on the same
    separator gives us one chunk per slide.
    """
    parts = mdx_text.split("\n---\n")
    # parts[0] is the opening '---\n<yaml>' chunk (no leading newline before
    # the first ---, so split sees it as the first part). Drop it.
    return [chunk.strip() for chunk in parts[1:] if chunk.strip()]


# ── Title extraction ─────────────────────────────────────────────────────

H2_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
TITLECARD_RE = re.compile(
    r"<TitleCard\b([^>]*)>(.+?)</TitleCard>", re.DOTALL
)
TITLECARD_BADGE_RE = re.compile(r'badge\s*=\s*"([^"]+)"')
SPEAKERCARD_NAME_RE = re.compile(r'<SpeakerCard\b[^>]*\bname\s*=\s*"([^"]+)"')


def extract_title(slide: str, index_1based: int) -> str:
    """Return the most informative title we can find for a slide chunk."""
    m = H2_RE.search(slide)
    if m:
        return m.group(1).strip()

    m = TITLECARD_RE.search(slide)
    if m:
        attrs, body = m.group(1), m.group(2).strip()
        badge_m = TITLECARD_BADGE_RE.search(attrs)
        if badge_m:
            return f"{badge_m.group(1).strip()} — {body}"
        return body

    m = SPEAKERCARD_NAME_RE.search(slide)
    if m:
        return f"Speaker — {m.group(1).strip()}"

    return f"Slide {index_1based}"


# ── Notes extraction ─────────────────────────────────────────────────────

NOTES_RE = re.compile(r"<Notes>(.*?)</Notes>", re.DOTALL)


def extract_notes(slide: str) -> str:
    """Return the speaker notes block (text only), or empty string if none."""
    m = NOTES_RE.search(slide)
    if not m:
        return ""
    text = m.group(1).strip()
    # Collapse whitespace within paragraphs; preserve paragraph breaks.
    paragraphs = [
        re.sub(r"\s+", " ", p).strip()
        for p in re.split(r"\n\s*\n", text)
    ]
    return "\n\n".join(p for p in paragraphs if p)


# ── Screenshot list ──────────────────────────────────────────────────────


def list_screenshots(folder: Path) -> list[Path]:
    """Screenshots sorted chronologically (filename = timestamp)."""
    pngs = sorted(folder.glob("*.png"))
    return pngs


# ── MD output ────────────────────────────────────────────────────────────


def md_image_link(image_path: Path, alt: str) -> str:
    """Markdown image with URL-encoded src (filename has spaces)."""
    return f"![{alt}]({quote(image_path.name)})"


def write_images_md(
    slides: list[tuple[int, str, str]], screenshots: list[Path]
) -> None:
    lines: list[str] = []
    lines.append("# DDD Europe deck — visual review")
    lines.append("")
    lines.append(
        "One image per slide with its title and slide index. "
        "Use this together with `00-slides-script.md` to suggest cuts, "
        "trims, or reorderings."
    )
    lines.append("")
    lines.append(f"Total slides: **{len(slides)}**.")
    lines.append("")

    for i, (idx, title, _notes) in enumerate(slides):
        if i < len(screenshots):
            shot = screenshots[i]
            img_md = md_image_link(shot, f"Slide {idx} — {title}")
        else:
            img_md = "_(no screenshot)_"

        lines.append(f"## {idx:02d} · {title}")
        lines.append("")
        lines.append(img_md)
        lines.append("")
        lines.append("---")
        lines.append("")

    IMAGES_OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {IMAGES_OUT}  ({len(slides)} slides)")


def write_script_md(slides: list[tuple[int, str, str]]) -> None:
    lines: list[str] = []
    lines.append("# DDD Europe deck — speaker script")
    lines.append("")
    lines.append(
        "Slide-by-slide notes pulled from the `<Notes>` blocks in the MDX. "
        "Use together with `00-slides-images.md` to evaluate pacing and "
        "verbal flow."
    )
    lines.append("")
    lines.append(f"Total slides: **{len(slides)}**.")
    lines.append("")

    no_notes_count = 0
    for idx, title, notes in slides:
        lines.append(f"## {idx:02d} · {title}")
        lines.append("")
        if notes:
            lines.append(notes)
        else:
            lines.append("_(no speaker notes on this slide)_")
            no_notes_count += 1
        lines.append("")
        lines.append("---")
        lines.append("")

    SCRIPT_OUT.write_text("\n".join(lines), encoding="utf-8")
    print(
        f"wrote {SCRIPT_OUT}  ({len(slides)} slides, "
        f"{no_notes_count} without speaker notes)"
    )


# ── Main ─────────────────────────────────────────────────────────────────


def main() -> int:
    if not MDX_PATH.exists():
        print(f"missing MDX file: {MDX_PATH}", file=sys.stderr)
        return 1

    if not SCREENSHOTS_DIR.exists():
        print(f"missing screenshots folder: {SCREENSHOTS_DIR}", file=sys.stderr)
        return 1

    mdx_text = MDX_PATH.read_text(encoding="utf-8")
    raw_slides = split_slides(mdx_text)

    slides: list[tuple[int, str, str]] = []
    for i, chunk in enumerate(raw_slides, start=1):
        title = extract_title(chunk, i)
        notes = extract_notes(chunk)
        slides.append((i, title, notes))

    screenshots = list_screenshots(SCREENSHOTS_DIR)

    print(f"parsed {len(slides)} slides from MDX")
    print(f"found {len(screenshots)} screenshots in {SCREENSHOTS_DIR}")
    if len(slides) != len(screenshots):
        print(
            f"WARN: slide count ({len(slides)}) != screenshot count "
            f"({len(screenshots)}). Pairing by order anyway; the tail "
            f"may be mismatched.",
            file=sys.stderr,
        )

    write_images_md(slides, screenshots)
    write_script_md(slides)
    return 0


if __name__ == "__main__":
    sys.exit(main())
