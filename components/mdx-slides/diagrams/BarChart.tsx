"use client";

import styles from "./Diagrams.module.css";

interface BarChartProps {
  bars: string;
}

interface BarData {
  label: string;
  value: number;
  max: number;
  danger: boolean;
}

const BAR_COLORS = [
  { fill: "#6b8aad", pattern: "bar-stripe" },
  { fill: "#6b9a6b", pattern: "bar-dot" },
  { fill: "#8a6bad", pattern: "bar-dot2" },
  { fill: "#5a9ab8", pattern: "bar-stripe2" },
  { fill: "#b89a5a", pattern: "bar-cross" },
];

const DANGER_COLOR = { fill: "#B55A5A", pattern: null };

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

export function BarChart({ bars }: BarChartProps) {
  const items = parseBars(bars);
  const barHeight = 32;
  const gap = 16;
  const labelWidth = 180;
  const chartWidth = 400;
  const totalWidth = labelWidth + chartWidth + 60;
  const totalHeight = items.length * (barHeight + gap) + gap;

  return (
    <div className={styles.barChartContainer}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className={styles.barChartSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="bar-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          </pattern>
          <pattern id="bar-dot" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.2" fill="rgba(255,255,255,0.3)" />
          </pattern>
          <pattern id="bar-cross" width="6" height="6" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3" x2="6" y2="3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <line x1="3" y1="0" x2="3" y2="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
          </pattern>
          <pattern id="bar-stripe2" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
          </pattern>
          <pattern id="bar-dot2" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="rgba(255,255,255,0.25)" />
          </pattern>
        </defs>

        {items.map((item, i) => {
          const y = gap + i * (barHeight + gap);
          const pct = item.value / item.max;
          const barW = chartWidth * pct;
          const colorSet = item.danger ? DANGER_COLOR : BAR_COLORS[i % BAR_COLORS.length];

          return (
            <g key={item.label}>
              {/* Label */}
              <text
                x={labelWidth - 12}
                y={y + barHeight / 2 + 5}
                textAnchor="end"
                fill={item.danger ? "#B55A5A" : "var(--color-text-secondary)"}
                fontSize="13"
                fontFamily="var(--font-mono)"
                fontWeight={item.danger ? "900" : "700"}
              >
                {item.label}
              </text>

              {/* Track */}
              <rect
                x={labelWidth}
                y={y}
                width={chartWidth}
                height={barHeight}
                fill="var(--color-bg-secondary)"
                stroke="var(--color-border)"
                strokeWidth="2"
              />

              {/* Fill — base color */}
              {barW > 0 && (
                <rect
                  x={labelWidth}
                  y={y}
                  width={barW}
                  height={barHeight}
                  fill={colorSet.fill}
                  stroke="var(--color-border)"
                  strokeWidth="2"
                />
              )}

              {/* Fill — pattern overlay */}
              {barW > 0 && colorSet.pattern && (
                <rect
                  x={labelWidth}
                  y={y}
                  width={barW}
                  height={barHeight}
                  fill={`url(#${colorSet.pattern})`}
                  stroke="none"
                />
              )}

              {/* Value */}
              <text
                x={labelWidth + barW + 8}
                y={y + barHeight / 2 + 5}
                textAnchor="start"
                fill={item.danger ? "#B55A5A" : "var(--color-text-muted)"}
                fontSize="12"
                fontFamily="var(--font-mono)"
                fontWeight="900"
              >
                {item.value}/{item.max}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
