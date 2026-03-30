"use client";

import styles from "./Diagrams.module.css";

interface PieChartProps {
  slices: string;
  source?: string;
}

interface SliceData {
  label: string;
  percent: number;
  highlight: boolean;
}

const PATTERNS = [
  { id: "pie-stripe", fill: "var(--color-text-secondary)" },
  { id: "pie-dot", fill: "var(--color-text-secondary)" },
  { id: "pie-grid", fill: "var(--color-text-secondary)" },
  { id: "pie-stripe-rev", fill: "var(--color-text-secondary)" },
  { id: "pie-solid", fill: "var(--color-text-muted)" },
];

const HIGHLIGHT_PATTERN = { id: null, fill: "#B55A5A" };

function parseSlices(input: string): SliceData[] {
  return input.split("|").map((entry) => {
    const parts = entry.trim().split("::");
    return {
      label: parts[0]?.trim() || "",
      percent: Number(parts[1]?.trim() || 0),
      highlight: parts[2]?.trim() === "highlight",
    };
  });
}

export function PieChart({ slices, source }: PieChartProps) {
  const items = parseSlices(slices);
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;

  let angle = -Math.PI / 2;

  return (
    <div className={styles.pieContainer}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={styles.pieChartSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="pie-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-bg)" strokeWidth="1.5" />
          </pattern>
          <pattern id="pie-dot" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.2" fill="var(--color-bg)" />
          </pattern>
          <pattern id="pie-grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="var(--color-bg)" strokeWidth="1" />
            <line x1="3" y1="0" x2="3" y2="6" stroke="var(--color-bg)" strokeWidth="1" />
          </pattern>
          <pattern id="pie-stripe-rev" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-bg)" strokeWidth="1.5" />
          </pattern>
        </defs>

        <rect x="0" y="0" width={size} height={size} fill="none" stroke="var(--color-text)" strokeWidth="3" />

        {items.map((item, i) => {
          const sliceAngle = (item.percent / 100) * Math.PI * 2;
          const x1 = cx + r * Math.cos(angle);
          const y1 = cy + r * Math.sin(angle);
          angle += sliceAngle;
          const x2 = cx + r * Math.cos(angle);
          const y2 = cy + r * Math.sin(angle);
          const large = sliceAngle > Math.PI ? 1 : 0;
          const pat = item.highlight ? HIGHLIGHT_PATTERN : PATTERNS[i % PATTERNS.length];
          const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;

          return (
            <g key={item.label}>
              <path d={d} fill={pat.fill} stroke="var(--color-bg)" strokeWidth="2" />
              {pat.id && (
                <path d={d} fill={`url(#${pat.id})`} stroke="none" />
              )}
            </g>
          );
        })}
      </svg>

      <div className={styles.pieLegend}>
        {items.map((item, i) => {
          const pat = item.highlight ? HIGHLIGHT_PATTERN : PATTERNS[i % PATTERNS.length];
          return (
            <div key={item.label} className={`${styles.pieLegendItem} ${item.highlight ? styles.pieLegendHighlight : ""}`}>
              <span className={styles.pieSwatch} style={{ backgroundColor: pat.fill }} />
              <span className={styles.pieLegendLabel}>{item.label}</span>
              <span className={styles.pieLegendPercent}>{item.percent}%</span>
            </div>
          );
        })}
      </div>
      {source && <div className={styles.pieSource}>{source}</div>}
    </div>
  );
}
