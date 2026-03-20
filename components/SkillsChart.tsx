"use client";

import type { SkillGroup } from "@/content/profile";
import styles from "./SkillsChart.module.css";

interface SkillsChartProps {
  groups: SkillGroup[];
}

const PATTERNS = [
  "dots",
  "lines",
  "crosshatch",
  "diagonal",
] as const;

const COLORS = [
  "var(--color-accent)",
  "var(--color-accent-secondary)",
  "var(--color-accent-tertiary)",
  "#B07070",
];

function PatternDefs() {
  return (
    <defs>
      {/* Dots */}
      <pattern id="pat-dots" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={COLORS[0]} fillOpacity="0.3" />
        <circle cx="3" cy="3" r="1.2" fill={COLORS[0]} fillOpacity="0.8" />
      </pattern>
      {/* Horizontal lines */}
      <pattern id="pat-lines" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={COLORS[1]} fillOpacity="0.25" />
        <line x1="0" y1="2" x2="6" y2="2" stroke={COLORS[1]} strokeWidth="1.5" strokeOpacity="0.7" />
        <line x1="0" y1="5" x2="6" y2="5" stroke={COLORS[1]} strokeWidth="1" strokeOpacity="0.5" />
      </pattern>
      {/* Crosshatch */}
      <pattern id="pat-crosshatch" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={COLORS[2]} fillOpacity="0.2" />
        <line x1="0" y1="0" x2="6" y2="6" stroke={COLORS[2]} strokeWidth="1" strokeOpacity="0.6" />
        <line x1="6" y1="0" x2="0" y2="6" stroke={COLORS[2]} strokeWidth="1" strokeOpacity="0.6" />
      </pattern>
      {/* Diagonal lines */}
      <pattern id="pat-diagonal" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={COLORS[3]} fillOpacity="0.25" />
        <line x1="0" y1="0" x2="6" y2="6" stroke={COLORS[3]} strokeWidth="1.5" strokeOpacity="0.7" />
      </pattern>
    </defs>
  );
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export function SkillsChart({ groups }: SkillsChartProps) {
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const cx = 120;
  const cy = 120;
  const r = 105;

  let cumulative = 0;
  const slices = groups.map((group, i) => {
    const pct = (group.items.length / total) * 360;
    const startAngle = cumulative;
    cumulative += pct;
    return {
      ...group,
      startAngle,
      endAngle: cumulative,
      pattern: PATTERNS[i % PATTERNS.length],
      color: COLORS[i % COLORS.length],
      index: i,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.chartWrap}>
        <svg
          viewBox="0 0 240 240"
          className={styles.svg}
          aria-hidden="true"
        >
          <PatternDefs />
          {slices.map((slice) => (
            <path
              key={slice.label}
              d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
              fill={`url(#pat-${slice.pattern})`}
              stroke="var(--color-bg)"
              strokeWidth="2"
            />
          ))}
          {/* Center circle */}
          <circle
            cx={cx}
            cy={cy}
            r="35"
            fill="var(--color-bg)"
            stroke="var(--color-border)"
            strokeWidth="2"
          />
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fill="var(--color-text)"
            fontSize="10"
            fontFamily="var(--font-mono)"
            fontWeight="900"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight="700"
          >
            TRAITS
          </text>
        </svg>
      </div>

      <div className={styles.legend}>
        {slices.map((slice) => (
          <div key={slice.label} className={styles.legendGroup}>
            <div className={styles.legendHeader}>
              <span
                className={styles.legendSwatch}
                data-pattern={slice.pattern}
                style={{ borderColor: slice.color }}
              />
              <span className={styles.legendIcon}>{slice.icon}</span>
              <span className={styles.legendLabel}>{slice.label}</span>
            </div>
            <ul className={styles.legendItems}>
              {slice.items.map((item) => (
                <li key={item.name} className={styles.legendItem}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span
                    className={styles.itemBar}
                    style={{
                      width: `${item.level}%`,
                      backgroundColor: slice.color,
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
