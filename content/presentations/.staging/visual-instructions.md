# Visual Instructions for Mono-Space Agent

These are detailed instructions for creating the diagrams, charts, and visual elements in the AI Engineer workshop presentation. Each diagram should be built with code (CSS/HTML/SVG) — no external images except the ones Raj provides.

## Design Principles
- Neo-brutalist: heavy borders (2-3px), no rounded corners, no shadows, no gradients
- Dark mode: dark grays (#1A1A1A, #222, #2A2A2A), muted accents
- Typography: JetBrains Mono for labels/data, system-ui for body
- Colors: use sparingly — accent (#C4A35A), danger (#B55A5A), success (#5AB55A), info (#5A8AB5), warning (#B5955A)
- Whitespace: generous. Let elements breathe.

---

## Slide 3: Act Boxes (Workshop Overview)

Three bordered boxes arranged horizontally (or stacked on mobile). Each box has:
- A header bar with the act name (SITUATION / PROBLEM / RESOLUTION)
- Header bar colored with a muted accent — not bright
- Inside: bullet list of items (like a Jira card)
- Each box has a subtle left border accent color (amber for situation, red for problem, green for resolution)

Think: Kanban columns but as a table of contents.

---

## Slide 6: Evolution Timeline

Vertical timeline, 4 nodes. Each node:
- Year (2023, 2024, 2025, 2026) on the left
- Connected by a thick vertical line
- Right side: main text + italic subtext
- The 2026 node is visually different — larger, accent-bordered, maybe a pulse/glow CSS animation
- A small stat badge next to 2026: "90% pilots failing | $40B invested"

Think: Git log visual but for industry evolution.

---

## Slide 9: Code != Development (Jira Tickets)

6 ticket cards in a 2-column grid (3 per column). Each card:
- Header: ticket ID (monospace, accent color) + title
- Body: "Acceptance: ..." in normal text
- Body: "Context needed: " followed by redacted blocks
- Redacted blocks are actual colored bars:
  - Green blocks (█████) for info the agent has from training
  - Orange blocks (█████) for info available via extensions
  - Red blocks (█████) for tribal/domain knowledge — NOT available

The cards should look like real Jira tickets — bordered, compact, with a left-side color strip indicating type (bug=red, task=blue, story=green). But simplified.

DON'T use actual █ characters for the redacted text in the visual version — use CSS rectangles:
```css
.redacted {
  display: inline-block;
  height: 1em;
  background: var(--color-danger); /* or success/warning */
  border-radius: 0;
  vertical-align: middle;
}
.redacted--green { width: 140px; background: var(--color-success); }
.redacted--orange { width: 180px; background: var(--color-warning); }
.redacted--red { width: 200px; background: var(--color-danger); }
```

This makes the color distinction visually powerful — the audience sees green/orange/red blocks and immediately gets it.

---

## Slide 10: "Kind Of" Solution Diagram

Left-to-right flow diagram with 4 stages:

```
[SOURCES]  →  [RETRIEVAL LAYER]  →  [AGENT]  →  [ROI]
```

**Sources box:** 4 small icons/labels stacked vertically:
- Confluence (document icon or just "CF")
- Jira (ticket icon or "JIRA")
- SharePoint (folder icon or "SP")
- GitHub (code icon or "GH")

Each source is a small bordered box inside a larger container.

**Retrieval Layer:** Larger box with interior labels:
- "RAG"
- "MCP Servers"
- "Vector DB"
- "Knowledge Graph"

These labels are inside the box, each on its own line, small monospace text.

**Agent:** Box with:
- "Agent"
- "Skills + Rules + Hooks"

**ROI:** Final box, accent-bordered:
- "Business Value"
- "Epics Moving"

Arrows between stages: thick, accent-colored, with arrow heads.
The whole thing should feel like an architecture diagram but clean and readable.

---

## Slide 12: Pie Chart (Knowledge Quality)

Create a CSS-only pie chart (using conic-gradient):

```css
.pie-chart {
  width: 280px;
  height: 280px;
  border-radius: 0; /* neo-brutalist: square, not round */
  border: 3px solid var(--color-border-heavy);
  background: conic-gradient(
    var(--color-success) 0% 10%,      /* Clean: 10% */
    var(--color-warning) 10% 30%,      /* Outdated: 20% */
    var(--color-info) 30% 50%,         /* Unreliable: 20% */
    var(--color-text-muted) 50% 60%,   /* Duplicated: 10% */
    var(--color-danger) 60% 100%       /* Tribal: 40% */
  );
}
```

YES — a square pie chart. Neo-brutalist. No rounded corners even for the chart.

Legend below the chart with color swatches + labels + percentages.

The "TRIBAL 40%" label should be larger/bolder than the others. Maybe pulled out with a line annotation.

---

## Slide 14: DDC Lifecycle Diagram

Circular lifecycle with 6 nodes:

```
        PROBLEM
       /       \
  SUCCEEDS    FAILS
     |          |
  CURATE    CHECKLIST
     \          |
      FILL GAPS
```

Each node is a bordered box. Connected by thick arrows that curve slightly (use SVG path or CSS borders with transforms).

Center of the circle: "30-60 min / cycle" in muted text.

An outer arrow from SUCCEEDS back to PROBLEM, labeled "Next problem →"

Color the nodes:
- PROBLEM: neutral border
- FAILS: danger border (red)
- CHECKLIST: warning border (amber)
- FILL GAPS: info border (blue)
- CURATE: accent border (gold)
- SUCCEEDS: success border (green)

---

## Slide 19: Automation Flow Diagram

Vertical flow (top to bottom):

**Top row:** Three input boxes side by side:
- "50 Jira Tickets" (with small ticket icon or JIRA label)
- "50 Incidents" (with alert icon or SRE label)
- "30 Conversations" (with chat icon or CS label)

All three have arrows pointing down into:

**Middle:** Large central box, accent-bordered:
- Title: "DDC FRAMEWORK"
- Two side inputs:
  - Left arrow in: "Existing KB" (small box)
  - Right arrow in: "Domain Description" (small box)

Arrow down from DDC FRAMEWORK to:

**Bottom:** Output box, success-bordered:
- "DISCOVERED & CURATED CONTEXT"
- Subtitle: "Prioritized by severity. Classified by quality."

The DDC FRAMEWORK box should be the visual center of gravity — largest, accent-bordered, bold title.

---

## General: How to Make Diagrams Attractive (Not Stale)

1. **Use subtle animation:** Fade-in or slide-up for diagram elements. Don't animate everything — just the key element (like the central DDC box).

2. **Layer information:** Show the diagram structure first, then highlight/animate the important parts.

3. **Use whitespace aggressively:** Don't cram boxes together. Let arrows be long. White space makes diagrams feel professional.

4. **Consistent sizing:** All boxes in a row should be the same height. All text inside boxes should be the same font size. Consistency reads as "polished."

5. **Border hierarchy:** The most important box gets a 3px accent border. Secondary boxes get 2px normal border. Tertiary elements get 1px muted border.

6. **Labels INSIDE boxes, not outside.** Reduces visual clutter. The box IS the label container.

7. **Arrows:** Thick (2-3px), accent-colored, with clear direction. No tiny arrows. If using SVG, use `stroke-width: 2.5` minimum.

8. **No clip art, no icons from icon libraries.** Use monospace text labels instead (CF, GH, JIRA, SRE). This is neo-brutalist — text IS the visual.
