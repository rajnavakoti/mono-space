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
  const axisMarginBottom = 55;
  const topPad = 30;
  const chartAreaWidth = items.length * (barWidth + gap) + gap;
  const annotationSpace = annotation ? 80 : 0;
  const totalWidth = axisMarginLeft + chartAreaWidth + 20 + annotationSpace;
  const totalHeight = topPad + chartHeight + axisMarginBottom;
  const maxVal = Math.max(...items.map((i) => i.max));

  const ticks = [0, 2, 4, 6, 8, 10].filter((t) => t <= maxVal);

  const dangerIndex = items.findIndex((i) => i.danger);
  const dangerBarX =
    dangerIndex >= 0
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
          <marker
            id="bar-arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#B55A5A" />
          </marker>
        </defs>

        {/* Y-axis */}
        <line
          x1={axisMarginLeft}
          y1={topPad}
          x2={axisMarginLeft}
          y2={topPad + chartHeight}
          stroke="var(--color-border)"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={axisMarginLeft}
          y1={topPad + chartHeight}
          x2={axisMarginLeft + chartAreaWidth}
          y2={topPad + chartHeight}
          stroke="var(--color-border)"
          strokeWidth="2"
        />

        {/* Y-axis ticks + grid */}
        {ticks.map((tick) => {
          const y = topPad + chartHeight - (tick / maxVal) * chartHeight;
          return (
            <g key={`tick-${tick}`}>
              <text
                x={axisMarginLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--color-text-muted)"
                fontSize="10"
                fontFamily="var(--font-mono)"
              >
                {tick}
              </text>
              {tick > 0 && (
                <line
                  x1={axisMarginLeft}
                  y1={y}
                  x2={axisMarginLeft + chartAreaWidth}
                  y2={y}
                  stroke="var(--color-border-muted)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              )}
            </g>
          );
        })}

        {/* Bars */}
        {items.map((item, i) => {
          const x = axisMarginLeft + gap + i * (barWidth + gap);
          const barH = (item.value / maxVal) * chartHeight;
          const y = topPad + chartHeight - barH;
          const fill = item.danger ? "#B55A5A" : "var(--color-text-secondary)";

          return (
            <g key={item.label}>
              {/* Bar fill */}
              {barH > 0 && (
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  fill={fill}
                  stroke="var(--color-border)"
                  strokeWidth="2"
                />
              )}

              {/* Dashed outline for 0-value danger bar */}
              {item.danger && barH === 0 && (
                <rect
                  x={x}
                  y={topPad}
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
                y={barH > 0 ? y - 8 : topPad + chartHeight / 2}
                textAnchor="middle"
                fill={item.danger ? "#B55A5A" : "var(--color-text)"}
                fontSize="12"
                fontFamily="var(--font-mono)"
                fontWeight="900"
              >
                {item.value}/{item.max}
              </text>

              {/* Label below x-axis — handle multi-word */}
              {item.label.split(" ").length > 1 ? (
                <text
                  x={x + barWidth / 2}
                  y={topPad + chartHeight + 18}
                  textAnchor="middle"
                  fill={item.danger ? "#B55A5A" : "var(--color-text-secondary)"}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fontWeight={item.danger ? "900" : "700"}
                >
                  {item.label.split(" ").map((word, wi) => (
                    <tspan key={wi} x={x + barWidth / 2} dy={wi === 0 ? 0 : 12}>
                      {word}
                    </tspan>
                  ))}
                </text>
              ) : (
                <text
                  x={x + barWidth / 2}
                  y={topPad + chartHeight + 18}
                  textAnchor="middle"
                  fill={item.danger ? "#B55A5A" : "var(--color-text-secondary)"}
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fontWeight={item.danger ? "900" : "700"}
                >
                  {item.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Curved annotation arrow */}
        {annotation && dangerIndex >= 0 && (
          <g>
            <path
              d={`M ${dangerBarX + barWidth + 40} ${topPad + 40} C ${dangerBarX + barWidth + 30} ${topPad + chartHeight - 40}, ${dangerBarX + 20} ${topPad + chartHeight - 20}, ${dangerBarX + barWidth / 2 + 4} ${topPad + chartHeight - 10}`}
              fill="none"
              stroke="#B55A5A"
              strokeWidth="2"
              markerEnd="url(#bar-arrowhead)"
            />
            <text
              x={dangerBarX + barWidth + 44}
              y={topPad + 38}
              textAnchor="start"
              fill="#B55A5A"
              fontSize="11"
              fontFamily="var(--font-mono)"
              fontWeight="700"
            >
              {annotation.split("\\n").map((line, li) => (
                <tspan key={li} x={dangerBarX + barWidth + 44} dy={li === 0 ? 0 : 14}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
