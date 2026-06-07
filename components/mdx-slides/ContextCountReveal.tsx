/**
 * <ContextCountReveal
 *    leftLabel="What the team remembers"
 *    leftSource="From Event Storming"
 *    leftContexts="Order|Warehouse|Customer"
 *
 *    rightLabel="What the system encoded"
 *    rightSource="From forensic evidence"
 *    rightContexts="Order|Delivery|Invoicing|Inventory|Returns/Policy|Customer|Warehouse"
 *
 *    leftAccent="amber"
 *    rightAccent="green"
 * />
 *
 * The "Remembered vs Encoded Domain" reveal for the closing arc. Each
 * panel shows a small SVG cluster of named circles — the number of
 * circles IS the punch. The audience reads "3 vs 7" in two seconds
 * without parsing prose.
 *
 * Same visual register as <BoundedContextMap />: stroked circles, no
 * fills, monochrome labels. Left circles tinted amber (the remembered
 * mental model — incomplete), right circles tinted green (the encoded
 * reality — what the seven exhibits actually surfaced).
 */
import styles from "./ContextCountReveal.module.css";

type Tone = "amber" | "green" | "red" | "neutral";

interface PanelProps {
  label: string;
  source: string;
  contexts: string[];
  tone: Tone;
}

interface ContextCountRevealProps {
  leftLabel: string;
  leftSource: string;
  /** Pipe-separated context names. */
  leftContexts: string;
  leftAccent?: Tone;

  rightLabel: string;
  rightSource: string;
  /** Pipe-separated context names. */
  rightContexts: string;
  rightAccent?: Tone;
}

const TONE_CLASS: Record<Tone, string> = {
  amber: "toneAmber",
  green: "toneGreen",
  red: "toneRed",
  neutral: "toneNeutral",
};

/**
 * Lay out N circles inside a viewBox 400×260. Hand-tuned positions
 * for n=2..8 so each cluster reads as a balanced shape rather than a
 * grid. Bigger n gets smaller radii so they all fit the same box.
 */
function layoutCircles(n: number): { cx: number; cy: number; r: number }[] {
  const VW = 400;
  const VH = 260;
  const cx = VW / 2;
  const cy = VH / 2;

  if (n === 1) return [{ cx, cy, r: 70 }];
  if (n === 2)
    return [
      { cx: cx - 75, cy, r: 60 },
      { cx: cx + 75, cy, r: 60 },
    ];
  if (n === 3)
    return [
      { cx: cx, cy: cy - 60, r: 56 },
      { cx: cx - 90, cy: cy + 50, r: 56 },
      { cx: cx + 90, cy: cy + 50, r: 56 },
    ];
  if (n === 4)
    return [
      { cx: cx - 90, cy: cy - 55, r: 48 },
      { cx: cx + 90, cy: cy - 55, r: 48 },
      { cx: cx - 90, cy: cy + 55, r: 48 },
      { cx: cx + 90, cy: cy + 55, r: 48 },
    ];
  if (n === 5)
    return [
      { cx: cx, cy: cy - 80, r: 44 },
      { cx: cx - 110, cy: cy - 10, r: 44 },
      { cx: cx + 110, cy: cy - 10, r: 44 },
      { cx: cx - 65, cy: cy + 80, r: 44 },
      { cx: cx + 65, cy: cy + 80, r: 44 },
    ];
  if (n === 6)
    return [
      { cx: cx - 110, cy: cy - 70, r: 42 },
      { cx: cx, cy: cy - 70, r: 42 },
      { cx: cx + 110, cy: cy - 70, r: 42 },
      { cx: cx - 110, cy: cy + 70, r: 42 },
      { cx: cx, cy: cy + 70, r: 42 },
      { cx: cx + 110, cy: cy + 70, r: 42 },
    ];
  if (n === 7)
    return [
      { cx: cx - 130, cy: cy - 75, r: 38 },
      { cx: cx, cy: cy - 90, r: 38 },
      { cx: cx + 130, cy: cy - 75, r: 38 },
      { cx: cx - 70, cy: cy + 10, r: 38 },
      { cx: cx + 70, cy: cy + 10, r: 38 },
      { cx: cx - 90, cy: cy + 90, r: 38 },
      { cx: cx + 90, cy: cy + 90, r: 38 },
    ];
  // n>=8 fallback — even distribution on a ring.
  const r = 38;
  const ringR = 90;
  return Array.from({ length: n }).map((_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: cx + Math.cos(angle) * ringR,
      cy: cy + Math.sin(angle) * ringR,
      r,
    };
  });
}

function Panel({ label, source, contexts, tone }: PanelProps) {
  const positions = layoutCircles(contexts.length);
  const toneClass = styles[TONE_CLASS[tone]];

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelLabel}>{label}</div>
        <div className={styles.panelMeta}>
          <span className={styles.panelCount}>{contexts.length}</span>
          <span className={styles.panelCountWord}>contexts</span>
        </div>
        <div className={styles.panelSource}>{source}</div>
      </div>

      <svg
        className={`${styles.svg} ${toneClass}`}
        viewBox="0 0 400 260"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {positions.map((p, i) => {
          // Font shrinks for tighter clusters so labels stay readable
          // without overflowing the circle outline.
          const fontSize = p.r >= 50 ? 14 : p.r >= 42 ? 12 : 11;
          // Long labels with a `/` (e.g. "Returns/Policy") split onto
          // two stacked lines so they actually fit inside the circle.
          const text = contexts[i];
          const parts = text.split("/");
          const multiline = parts.length > 1;
          return (
            <g key={i}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                className={styles.circle}
              />
              <text
                x={p.cx}
                y={p.cy + 4}
                className={styles.label}
                textAnchor="middle"
                fontSize={fontSize}
              >
                {multiline ? (
                  <>
                    <tspan x={p.cx} dy="-0.4em">
                      {parts[0]}
                    </tspan>
                    <tspan x={p.cx} dy="1.2em">
                      /{parts.slice(1).join("/")}
                    </tspan>
                  </>
                ) : (
                  text
                )}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ContextCountReveal({
  leftLabel,
  leftSource,
  leftContexts,
  leftAccent = "amber",
  rightLabel,
  rightSource,
  rightContexts,
  rightAccent = "green",
}: ContextCountRevealProps) {
  const leftList = leftContexts.split("|").map((c) => c.trim());
  const rightList = rightContexts.split("|").map((c) => c.trim());

  return (
    <figure className={styles.figure}>
      <Panel
        label={leftLabel}
        source={leftSource}
        contexts={leftList}
        tone={leftAccent}
      />
      <Panel
        label={rightLabel}
        source={rightSource}
        contexts={rightList}
        tone={rightAccent}
      />
    </figure>
  );
}
