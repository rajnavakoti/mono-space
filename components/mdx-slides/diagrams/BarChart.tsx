"use client";

import styles from "./Diagrams.module.css";

interface BarItem {
  label: string;
  value: number;
  max: number;
  color?: string;
  highlight?: boolean;
}

interface BarChartProps {
  bars: string;
  title?: string;
}

function parseBars(input: string): BarItem[] {
  return input.split("|").map((entry) => {
    const parts = entry.trim().split(":");
    const label = parts[0].trim();
    const value = Number(parts[1]?.trim() || 0);
    const max = Number(parts[2]?.trim() || 10);
    const color = parts[3]?.trim() || undefined;
    const highlight = parts[4]?.trim() === "true";
    return { label, value, max, color, highlight };
  });
}

export function BarChart({ bars, title }: BarChartProps) {
  const items = parseBars(bars);

  return (
    <div className={styles.barChartContainer}>
      {title && <div className={styles.barChartTitle}>{title}</div>}
      <div className={styles.barChartBars}>
        {items.map((item) => {
          const pct = (item.value / item.max) * 100;
          const barColor = item.color || (item.highlight ? "#B55A5A" : "#5AB55A");

          return (
            <div
              key={item.label}
              className={`${styles.barChartRow} ${item.highlight ? styles.barChartRowHighlight : ""}`}
            >
              <div className={styles.barChartLabel}>{item.label}</div>
              <div className={styles.barChartTrack}>
                <div
                  className={styles.barChartFill}
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barColor,
                  }}
                >
                  <span className={styles.barChartValue}>
                    {item.value}/{item.max}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
