/**
 * <BigStat value="83" label="incidents in 12 months" tone="amber" />
 *
 * Headline-number visual. Centered massive numeric/text value with a small
 * uppercase label underneath. Multiple can be stacked vertically for "the
 * scale of the problem in three big numbers" moments. Tone tints the value.
 *
 * Designed to be reusable for any dramatic count or scale moment — incident
 * counts, cost numbers, time scales, conversion rates.
 */
import styles from "./BigStat.module.css";

type Tone = "neutral" | "amber" | "red" | "green";

interface BigStatProps {
  /** The big number or short text (e.g. "83", "77%", "4×") */
  value: string;
  /** Optional small uppercase label rendered below */
  label?: string;
  /** Colour tint for the value */
  tone?: Tone;
}

const TONE_CLASS: Record<Tone, string> = {
  neutral: "toneNeutral",
  amber: "toneAmber",
  red: "toneRed",
  green: "toneGreen",
};

export function BigStat({ value, label, tone = "neutral" }: BigStatProps) {
  return (
    <div className={`${styles.container} ${styles[TONE_CLASS[tone]]}`}>
      <div className={styles.value}>{value}</div>
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
}
