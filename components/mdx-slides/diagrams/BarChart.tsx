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
  const barWidth = 56;
  const gap = 20;
  const chartHeight = 220;
  const axisMarginLeft = 36;
  const topPad = 30;
  const chartAreaWidth = items.length * (barWidth + gap) + gap;
  const totalWidth = axisMarginLeft + chartAreaWidth + 20;
  const totalHeight = topPad + chartHeight + 55;
  const maxVal = Math.max(...items.map((i) => i.max));
  const ticks = [0, 2, 4, 6, 8, 10].filter((t) => t <= maxVal);

  const dangerIndex = items.findIndex((i) => i.danger);
  const dangerBarCenterX = dangerIndex >= 0
    ? axisMarginLeft + gap + dangerIndex * (barWidth + gap) + barWidth / 2
    : 0;

  return (
    <div className={styles.barChartContainer}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className={styles.barChartSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="bp-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-text)" strokeWidth="1" />
          </pattern>
          <pattern id="bp-dot" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill="var(--color-text)" />
          </pattern>
          <pattern id="bp-grid" width="7" height="7" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3.5" x2="7" y2="3.5" stroke="var(--color-text)" strokeWidth="0.8" />
            <line x1="3.5" y1="0" x2="3.5" y2="7" stroke="var(--color-text)" strokeWidth="0.8" />
          </pattern>
          <pattern id="bp-stripe-rev" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-text)" strokeWidth="1" />
          </pattern>
          <marker id="bar-arrow" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#B55A5A" />
          </marker>
        </defs>

        {/* Y-axis */}
        <line x1={axisMarginLeft} y1={topPad} x2={axisMarginLeft} y2={topPad + chartHeight} stroke="var(--color-border)" strokeWidth="2" />
        {/* X-axis */}
        <line x1={axisMarginLeft} y1={topPad + chartHeight} x2={axisMarginLeft + chartAreaWidth} y2={topPad + chartHeight} stroke="var(--color-border)" strokeWidth="2" />

        {/* Y ticks */}
        {ticks.map((tick) => {
          const y = topPad + chartHeight - (tick / maxVal) * chartHeight;
          return (
            <g key={tick}>
              <text x={axisMarginLeft - 8} y={y + 4} textAnchor="end" fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-mono)">{tick}</text>
              {tick > 0 && <line x1={axisMarginLeft} y1={y} x2={axisMarginLeft + chartAreaWidth} y2={y} stroke="var(--color-border-muted)" strokeWidth="1" strokeDasharray="4 4" />}
            </g>
          );
        })}

        {/* Bars */}
        {items.map((item, i) => {
          const x = axisMarginLeft + gap + i * (barWidth + gap);
          const barH = (item.value / maxVal) * chartHeight;
          const y = topPad + chartHeight - barH;
          const patterns = ["bp-stripe", "bp-dot", "bp-grid", "bp-stripe-rev"];
          const pat = patterns[i % patterns.length];

          return (
            <g key={item.label}>
              {barH > 0 && !item.danger && (
                <>
                  {/* Light fill */}
                  <rect x={x} y={y} width={barWidth} height={barH} fill="var(--color-bg-tertiary)" stroke="var(--color-text)" strokeWidth="2" />
                  {/* Dark pattern on top */}
                  <rect x={x} y={y} width={barWidth} height={barH} fill={`url(#${pat})`} stroke="none" />
                </>
              )}

              {item.danger && barH === 0 && (
                <rect x={x} y={topPad} width={barWidth} height={chartHeight} fill="none" stroke="#B55A5A" strokeWidth="2" strokeDasharray="6 4" />
              )}

              {item.danger && barH > 0 && (
                <rect x={x} y={y} width={barWidth} height={barH} fill="#B55A5A" stroke="#B55A5A" strokeWidth="2" />
              )}

              {/* Value */}
              <text x={x + barWidth / 2} y={barH > 0 ? y - 8 : topPad + chartHeight / 2} textAnchor="middle" fill={item.danger ? "#B55A5A" : "var(--color-text)"} fontSize="12" fontFamily="var(--font-mono)" fontWeight="900">
                {item.value}/{item.max}
              </text>

              {/* Label */}
              <text x={x + barWidth / 2} y={topPad + chartHeight + 18} textAnchor="middle" fill={item.danger ? "#B55A5A" : "var(--color-text-secondary)"} fontSize="10" fontFamily="var(--font-mono)" fontWeight={item.danger ? "900" : "700"}>
                {item.label.split(" ").map((word, wi) => (
                  <tspan key={wi} x={x + barWidth / 2} dy={wi === 0 ? 0 : 12}>{word}</tspan>
                ))}
              </text>
            </g>
          );
        })}

        {/* Single curved arrow — from text above, curving down to top of danger bar */}
        {annotation && dangerIndex >= 0 && (
          <g>
            <text x={dangerBarCenterX + 50} y={topPad - 4} textAnchor="start" fill="#B55A5A" fontSize="11" fontFamily="var(--font-mono)" fontWeight="700">
              {annotation.split("\\n").map((line, li) => (
                <tspan key={li} x={dangerBarCenterX + 50} dy={li === 0 ? 0 : 14}>{line}</tspan>
              ))}
            </text>
            <path
              d={`M ${dangerBarCenterX + 46} ${topPad + 4} Q ${dangerBarCenterX + 20} ${topPad - 10}, ${dangerBarCenterX} ${topPad + 30}`}
              fill="none"
              stroke="#B55A5A"
              strokeWidth="2"
              markerEnd="url(#bar-arrow)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
