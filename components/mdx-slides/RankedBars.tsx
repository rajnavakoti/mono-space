/**
 * <RankedBars />
 *
 * Horizontal ranked-bar visualization. Each row: label | bar | value, with
 * the bar width proportional to value/max and the fill tinted by tone.
 * Designed for "count per category, sorted descending" data where a table
 * would feel dense — boundary incident counts, file lock contention, top-N
 * failure modes, etc.
 *
 * bars format: "Label::value::tone | Label::value::tone | ..."
 *   tone values: red | amber | yellow | green | neutral
 *
 * Optional `max` prop fixes the scale; otherwise it's derived from the
 * highest value in the bars.
 */
import styles from "./RankedBars.module.css";

type Tone = "red" | "amber" | "yellow" | "green" | "neutral";

interface RankedBarsProps {
  /** Pipe-separated bar entries: "Label::value::tone" */
  bars: string;
  /** Optional fixed max for scaling. Defaults to the highest value in bars. */
  max?: string | number;
}

interface BarData {
  label: string;
  value: number;
  tone: Tone;
}

const TONE_CLASS: Record<Tone, string> = {
  red: "toneRed",
  amber: "toneAmber",
  yellow: "toneYellow",
  green: "toneGreen",
  neutral: "toneNeutral",
};

function parseBars(input: string): BarData[] {
  return input.split("|").map((entry) => {
    const parts = entry.trim().split("::");
    return {
      label: parts[0]?.trim() || "",
      value: Number(parts[1]?.trim() || 0),
      tone: ((parts[2]?.trim() as Tone) || "neutral"),
    };
  });
}

export function RankedBars({ bars, max }: RankedBarsProps) {
  const items = parseBars(bars);
  const fixedMax = max != null ? Number(max) : NaN;
  const maxValue = Number.isFinite(fixedMax) ? fixedMax : Math.max(...items.map((i) => i.value));

  return (
    <div className={styles.container}>
      {items.map((item, i) => {
        const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        const toneClass = styles[TONE_CLASS[item.tone]];
        return (
          <div key={i} className={styles.row}>
            <div className={styles.label}>{item.label}</div>
            <div className={styles.track}>
              <div
                className={`${styles.fill} ${toneClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className={`${styles.value} ${toneClass}`}>{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
