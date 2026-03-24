"use client";

import { useState } from "react";
import type { SkillGroup } from "@/content/profile";
import styles from "./SkillsChart.module.css";

interface SkillsChartProps {
  groups: SkillGroup[];
}

const PATTERNS = ["dots", "lines", "crosshatch", "diagonal"] as const;

const COLORS = [
  "var(--color-accent)",
  "var(--color-accent-secondary)",
  "var(--color-accent-tertiary)",
  "#B07070",
];

/* Raw hex fallbacks for SVG patterns (CSS vars don't work in SVG fill) */
const SVG_COLORS = ["#C9A96E", "#7B8EA8", "#8A9A6B", "#B07070"];

function PatternDefs() {
  return (
    <defs>
      <pattern id="pat-dots" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={SVG_COLORS[0]} fillOpacity="0.25" />
        <circle cx="4" cy="4" r="1.5" fill={SVG_COLORS[0]} fillOpacity="0.8" />
      </pattern>
      <pattern id="pat-lines" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={SVG_COLORS[1]} fillOpacity="0.2" />
        <line x1="0" y1="3" x2="8" y2="3" stroke={SVG_COLORS[1]} strokeWidth="2" strokeOpacity="0.6" />
        <line x1="0" y1="7" x2="8" y2="7" stroke={SVG_COLORS[1]} strokeWidth="1" strokeOpacity="0.4" />
      </pattern>
      <pattern id="pat-crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={SVG_COLORS[2]} fillOpacity="0.15" />
        <line x1="0" y1="0" x2="8" y2="8" stroke={SVG_COLORS[2]} strokeWidth="1.5" strokeOpacity="0.5" />
        <line x1="8" y1="0" x2="0" y2="8" stroke={SVG_COLORS[2]} strokeWidth="1.5" strokeOpacity="0.5" />
      </pattern>
      <pattern id="pat-diagonal" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={SVG_COLORS[3]} fillOpacity="0.2" />
        <line x1="0" y1="0" x2="8" y2="8" stroke={SVG_COLORS[3]} strokeWidth="2" strokeOpacity="0.6" />
      </pattern>
    </defs>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function SkillsChart({ groups }: SkillsChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  const cx = 200;
  const cy = 200;
  const r = 150;
  const labelR = r + 40;
  const lineStartR = r + 5;
  const lineEndR = r + 25;

  let cumulative = 0;
  const slices = groups.map((group, i) => {
    const pct = (group.items.length / total) * 360;
    const startAngle = cumulative;
    cumulative += pct;
    const midAngle = startAngle + pct / 2;
    return {
      ...group,
      startAngle,
      endAngle: cumulative,
      midAngle,
      pattern: PATTERNS[i % PATTERNS.length],
      color: COLORS[i % COLORS.length],
      svgColor: SVG_COLORS[i % SVG_COLORS.length],
      index: i,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.chartWrap}>
        <svg
          viewBox="0 0 400 400"
          className={styles.svg}
          aria-hidden="true"
        >
          <PatternDefs />

          {/* Slices */}
          {slices.map((slice) => (
            <path
              key={slice.label}
              d={describeArc(cx, cy, r, slice.startAngle, slice.endAngle)}
              fill={`url(#pat-${slice.pattern})`}
              stroke="var(--color-bg)"
              strokeWidth="3"
              className={`${styles.slice} ${active === slice.index ? styles.sliceActive : ""} ${active !== null && active !== slice.index ? styles.sliceDimmed : ""}`}
              onMouseEnter={() => setActive(slice.index)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: "pointer" }}
            />
          ))}

          {/* Center donut hole */}
          <circle cx={cx} cy={cy} r="50" fill="var(--color-bg)" stroke="var(--color-border)" strokeWidth="2" />
          <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--color-text)" fontSize="16" fontFamily="monospace" fontWeight="900">
            {total}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="monospace" fontWeight="700" letterSpacing="0.1em">
            TRAITS
          </text>

          {/* Label lines + text */}
          {slices.map((slice) => {
            const lineStart = polarToCartesian(cx, cy, lineStartR, slice.midAngle);
            const lineEnd = polarToCartesian(cx, cy, lineEndR, slice.midAngle);
            const labelPos = polarToCartesian(cx, cy, labelR, slice.midAngle);
            const isRight = labelPos.x > cx;

            return (
              <g key={`label-${slice.label}`} className={styles.labelGroup}>
                <line
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                  stroke={slice.svgColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.6"
                />
                <text
                  x={labelPos.x + (isRight ? 6 : -6)}
                  y={labelPos.y + 4}
                  textAnchor={isRight ? "start" : "end"}
                  fill={slice.svgColor}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="700"
                  letterSpacing="0.05em"
                >
                  {slice.icon} {slice.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover tooltip */}
      {active !== null && (
        <div className={styles.tooltip} style={{ borderColor: slices[active].color }}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipIcon}>{slices[active].icon}</span>
            <span className={styles.tooltipLabel}>{slices[active].label}</span>
          </div>
          <ul className={styles.tooltipList}>
            {slices[active].items.map((item) => (
              <li key={item.name} className={styles.tooltipItem}>
                <span className={styles.tooltipName}>{item.name}</span>
                <span
                  className={styles.tooltipBar}
                  style={{
                    width: `${item.level}%`,
                    backgroundColor: slices[active].color,
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mobile: show all groups as simple list when no hover */}
      <div className={styles.mobileList}>
        {slices.map((slice) => (
          <div key={slice.label} className={styles.mobileGroup}>
            <span className={styles.mobileLabel} style={{ color: slice.color }}>
              {slice.icon} {slice.label}
            </span>
            <span className={styles.mobileItems}>
              {slice.items.map((i) => i.name).join(" · ")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
