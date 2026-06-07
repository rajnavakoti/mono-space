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
 * panel shows the same set of labelled boxes — the COUNT of boxes is
 * the punch. The audience reads "3 vs 7" in two seconds without
 * parsing prose.
 *
 * Boxes flex-wrap and centre inside their panel so the layout never
 * overflows or overlaps regardless of label length or context count.
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
  leftContexts: string;
  leftAccent?: Tone;
  rightLabel: string;
  rightSource: string;
  rightContexts: string;
  rightAccent?: Tone;
}

const TONE_CLASS: Record<Tone, string> = {
  amber: "toneAmber",
  green: "toneGreen",
  red: "toneRed",
  neutral: "toneNeutral",
};

function Panel({ label, source, contexts, tone }: PanelProps) {
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

      <div className={`${styles.boxGrid} ${toneClass}`}>
        {contexts.map((c, i) => (
          <span key={i} className={styles.contextBox}>
            {c}
          </span>
        ))}
      </div>
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
