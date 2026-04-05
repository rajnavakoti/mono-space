"use client";

import styles from "./Diagrams.module.css";

interface BarChartProps {
  bars: string;
  annotation?: string;
}

interface BarData {
  label: string;
  value: number;
  max: number;
  danger: boolean;
}

function parseBars(input: string): BarData[] {
  return input.split("|").map((entry) => {
    const parts = entry.trim().split(":");
    return {
      label: parts[0]?.trim() || "",
      value: Number(parts[1]?.trim() || 0),
      max: Number(parts[2]?.trim() || 10),
      danger: parts[3]?.trim() === "danger",
    };
  });
}

export function BarChart({ bars, annotation }: BarChartProps) {
  const items = parseBars(bars);

  const patterns = ["bp-stripe", "bp-dot", "bp-grid", "bp-stripe-rev"];

  return (
    <div className={styles.barChartContainer}>
      <div className={styles.barChartGrid}>
        {items.map((item, i) => {
          const pct = (item.value / item.max) * 100;
          const pat = patterns[i % patterns.length];

          return (
            <div key={item.label} className={styles.barChartColumn}>
              <div className={styles.barChartValueLabel} style={item.danger ? { color: "#B55A5A" } : undefined}>
                {item.value}/{item.max}
              </div>
              <div className={styles.barChartTrack}>
                {!item.danger && pct > 0 && (
                  <div className={styles.barChartFill} style={{ height: `${pct}%` }}>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0 }}>
                      <defs>
                        <pattern id={`${pat}-${i}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform={pat.includes("rev") ? "rotate(-45)" : pat.includes("stripe") ? "rotate(45)" : undefined}>
                          {pat.includes("stripe") && <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-text)" strokeWidth="1" />}
                          {pat === "bp-dot" && <circle cx="3" cy="3" r="1" fill="var(--color-text)" />}
                          {pat === "bp-grid" && (
                            <>
                              <line x1="0" y1="3" x2="6" y2="3" stroke="var(--color-text)" strokeWidth="0.8" />
                              <line x1="3" y1="0" x2="3" y2="6" stroke="var(--color-text)" strokeWidth="0.8" />
                            </>
                          )}
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#${pat}-${i})`} />
                    </svg>
                  </div>
                )}
                {item.danger && (
                  <div className={styles.barChartDanger} />
                )}
              </div>
              <div className={styles.barChartLabel} style={item.danger ? { color: "#B55A5A", fontWeight: 900 } : undefined}>
                {item.label}
              </div>
              {item.danger && annotation && (
                <div className={styles.barChartAnnotation}>
                  <div className={styles.barChartAnnotationText}>
                    {annotation.split("\\n").map((line, li) => (
                      <div key={li}>{line}</div>
                    ))}
                  </div>
                  <div className={styles.barChartAnnotationArrow}>↓</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
