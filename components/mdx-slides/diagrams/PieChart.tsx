"use client";

import styles from "./Diagrams.module.css";

interface PieSlice {
  label: string;
  percent: number;
  color: string;
  highlight?: boolean;
}

interface PieChartProps {
  slices: PieSlice[];
  source?: string;
}

export function PieChart({ slices, source }: PieChartProps) {
  let cumulative = 0;
  const gradientStops = slices.map((slice) => {
    const start = cumulative;
    cumulative += slice.percent;
    return `${slice.color} ${start}% ${cumulative}%`;
  });

  return (
    <div className={styles.pieContainer}>
      <div
        className={styles.pieChart}
        style={{ background: `conic-gradient(${gradientStops.join(", ")})` }}
      />
      <div className={styles.pieLegend}>
        {slices.map((slice) => (
          <div
            key={slice.label}
            className={`${styles.pieLegendItem} ${slice.highlight ? styles.pieLegendHighlight : ""}`}
          >
            <span
              className={styles.pieSwatch}
              style={{ backgroundColor: slice.color }}
            />
            <span className={styles.pieLegendLabel}>{slice.label}</span>
            <span className={styles.pieLegendPercent}>{slice.percent}%</span>
          </div>
        ))}
      </div>
      {source && <div className={styles.pieSource}>{source}</div>}
    </div>
  );
}
