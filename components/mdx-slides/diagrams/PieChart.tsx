"use client";

import styles from "./Diagrams.module.css";

interface PieChartProps {
  slices: string;
  annotations?: string;
}

interface SliceData {
  label: string;
  percent: number;
  highlight: boolean;
}

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

function parseAnnotations(input: string): string[] {
  return input.split("|").map((s) => s.trim());
}

export function PieChart({ slices, annotations }: PieChartProps) {
  const items = parseSlices(slices);
  const notes = annotations ? parseAnnotations(annotations) : [];
  const pieSize = 280;
  const cx = pieSize / 2;
  const cy = pieSize / 2;
  const r = pieSize / 2 - 6;

  let angle = -Math.PI / 2;

  const sliceData = items.map((item) => {
    const sliceAngle = (item.percent / 100) * Math.PI * 2;
    const startAngle = angle;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sliceAngle;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const large = sliceAngle > Math.PI ? 1 : 0;
    const midAngle = startAngle + sliceAngle / 2;
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
    return { ...item, d, midAngle };
  });

  const margin = 300;
  const totalWidth = pieSize + margin * 2;
  const totalHeight = pieSize + margin * 2;
  const pieOffsetX = margin;
  const pieOffsetY = margin;

  return (
    <div className={styles.pieContainer}>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className={styles.pieChartSvg}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", maxWidth: "1100px", height: "auto", overflow: "visible" }}
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
          <marker id="pie-arrow" markerWidth="6" markerHeight="5" refX="1" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" fill="#B55A5A" />
          </marker>
        </defs>

        {/* Pie slices */}
        <g transform={`translate(${pieOffsetX}, ${pieOffsetY})`}>
          {sliceData.map((item, i) => {
            const patterns = ["pie-stripe", "pie-dot", "pie-grid", "pie-stripe-rev"];
            return (
              <g key={item.label}>
                <path d={item.d} fill={item.highlight ? "#B55A5A" : "var(--color-text-secondary)"} stroke="var(--color-bg)" strokeWidth="2.5" />
                {!item.highlight && (
                  <path d={item.d} fill={`url(#${patterns[i % patterns.length]})`} stroke="none" />
                )}
              </g>
            );
          })}
        </g>

        {/* Annotations */}
        {notes.length > 0 && sliceData.map((item, i) => {
          if (i >= notes.length || !notes[i]) return null;

          const edgeX = pieOffsetX + cx + r * Math.cos(item.midAngle);
          const edgeY = pieOffsetY + cy + r * Math.sin(item.midAngle);

          const isRight = item.midAngle > -Math.PI / 2 && item.midAngle < Math.PI / 2;
          const elbowX = isRight ? pieOffsetX + pieSize + 20 : pieOffsetX - 20;
          const labelX = isRight ? elbowX + 8 : elbowX - 8;
          const anchor = isRight ? "start" : "end";

          const typeLabel = `(${item.label.toLowerCase()})`;
          const fullText = `${typeLabel} ${notes[i]}`;
          const lines: string[] = [];
          const words = fullText.split(" ");
          let currentLine = "";
          for (const word of words) {
            if (currentLine && (currentLine + " " + word).length > 36) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = currentLine ? currentLine + " " + word : word;
            }
          }
          lines.push(currentLine);

          const lineHeight = 28;

          return (
            <g key={`ann-${i}`}>
              <line
                x1={edgeX}
                y1={edgeY}
                x2={elbowX}
                y2={edgeY}
                stroke="#B55A5A"
                strokeWidth="1.5"
                markerStart="url(#pie-arrow)"
              />
              <text
                x={labelX}
                y={edgeY - ((lines.length - 1) * lineHeight / 2)}
                textAnchor={anchor}
                fill="#B55A5A"
                fontSize="20"
                fontFamily="Comic Sans MS, Segoe Print, cursive"
                fontWeight="700"
                fontStyle="italic"
              >
                {lines.map((line, li) => (
                  <tspan key={li} x={labelX} dy={li === 0 ? 0 : lineHeight}>{line}</tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
