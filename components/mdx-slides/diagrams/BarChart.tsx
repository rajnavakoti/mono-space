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

const DANGER_COLOR = { fill: "#B55A5A", pattern: null as string | null };

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
  const barWidth = 60;
  const gap = 24;
  const chartHeight = 280;
  const axisMarginLeft = 40;
  const axisMarginBottom = 60;
  const chartAreaWidth = items.length * (barWidth + gap) + gap;
  const totalWidth = axisMarginLeft + chartAreaWidth + 20;
  const totalHeight = chartHeight + axisMarginBottom + 20;
  const maxVal = Math.max(...items.map((i) => i.max));

  const ticks = [0, 2, 4, 6, 8, 10].filter((t) => t <= maxVal);

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

        {/* Y-axis */}
        <line
          x1={axisMarginLeft}
          y1={10}
          x2={axisMarginLeft}
          y2={chartHeight + 10}
          stroke="var(--color-border)"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={axisMarginLeft}
          y1={chartHeight + 10}
          x2={axisMarginLeft + chartAreaWidth}
          y2={chartHeight + 10}
          stroke="var(--color-border)"
          strokeWidth="2"
        />

        {/* Y-axis ticks + grid lines */}
        {ticks.map((tick) => {
          const y = 10 + chartHeight - (tick / maxVal) * chartHeight;
          return (
            <g key={`tick-${tick}`}>
              <text
                x={axisMarginLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--color-text-muted)"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                {tick}
              </text>
              <line
                x1={axisMarginLeft}
                y1={y}
                x2={axisMarginLeft + chartAreaWidth}
                y2={y}
                stroke="var(--color-border-muted)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </g>
          );
        })}

        {/* Bars */}
        {items.map((item, i) => {
          const x = axisMarginLeft + gap + i * (barWidth + gap);
          const barH = (item.value / maxVal) * chartHeight;
          const y = 10 + chartHeight - barH;
          const colorSet = item.danger ? DANGER_COLOR : BAR_COLORS[i % BAR_COLORS.length];

          return (
            <g key={item.label}>
              {/* Bar fill — base color */}
              {barH > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill={colorSet.fill}
                  stroke="var(--color-border)"
                  strokeWidth="2"
                />
              )}

              {/* Bar fill — pattern overlay */}
              {barH > 0 && colorSet.pattern && (
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill={`url(#${colorSet.pattern})`}
                  stroke="none"
                />
              )}

              {/* Empty track for danger bar */}
              {item.danger && barH === 0 && (
                <rect
                  x={x}
                  y={10}
                  width={barWidth}
                  height={chartHeight}
                  fill="none"
                  stroke="#B55A5A"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              )}

              {/* Value on top */}
              <text
                x={x + barWidth / 2}
                y={barH > 0 ? y - 8 : 10 + chartHeight - 8}
                textAnchor="middle"
                fill={item.danger ? "#B55A5A" : "var(--color-text)"}
                fontSize="13"
                fontFamily="var(--font-mono)"
                fontWeight="900"
              >
                {item.value}/{item.max}
              </text>

              {/* Label below x-axis */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + 30}
                textAnchor="middle"
                fill={item.danger ? "#B55A5A" : "var(--color-text-secondary)"}
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight={item.danger ? "900" : "700"}
              >
                {item.label.length > 12
                  ? item.label.split(" ").map((word, wi) => (
                      <tspan key={wi} x={x + barWidth / 2} dy={wi === 0 ? 0 : 12}>
                        {word}
                      </tspan>
                    ))
                  : item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
