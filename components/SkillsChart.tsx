"use client";

import type { SkillGroup } from "@/content/profile";
import styles from "./SkillsChart.module.css";

interface SkillsChartProps {
  groups: SkillGroup[];
}

const accentColors = [
  "var(--color-accent)",
  "var(--color-accent-secondary)",
  "var(--color-accent-tertiary)",
  "#B07070",
];

export function SkillsChart({ groups }: SkillsChartProps) {
  return (
    <div className={styles.grid}>
      {groups.map((group, gi) => {
        const total = group.items.reduce((sum, item) => sum + item.level, 0);
        let cumulative = 0;

        const segments = group.items.map((item, i) => {
          const pct = (item.level / total) * 100;
          const start = cumulative;
          cumulative += pct;
          return { name: item.name, level: item.level, pct, start, index: i };
        });

        const conicStops = segments
          .map((seg) => {
            const patternIndex = seg.index % 5;
            const opacity = 0.4 + patternIndex * 0.15;
            return `color-mix(in srgb, ${accentColors[gi % 4]} ${Math.round(opacity * 100)}%, transparent) ${seg.start}% ${seg.start + seg.pct}%`;
          })
          .join(", ");

        return (
          <div key={group.label} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{group.icon}</span>
              <span className={styles.label}>{group.label}</span>
            </div>

            <div className={styles.chartRow}>
              <div
                className={styles.pie}
                style={{
                  background: `conic-gradient(${conicStops})`,
                  borderColor: accentColors[gi % 4],
                }}
                aria-hidden="true"
              >
                <div className={styles.pieCenter}>
                  <span className={styles.piePct}>
                    {Math.round(total / group.items.length)}%
                  </span>
                </div>
              </div>

              <ul className={styles.legend}>
                {segments.map((seg) => (
                  <li key={seg.name} className={styles.legendItem}>
                    <span
                      className={styles.legendDot}
                      style={{
                        backgroundColor: accentColors[gi % 4],
                        opacity: 0.4 + seg.index * 0.15,
                      }}
                    />
                    <span className={styles.legendName}>{seg.name}</span>
                    <span className={styles.legendLevel}>{seg.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
