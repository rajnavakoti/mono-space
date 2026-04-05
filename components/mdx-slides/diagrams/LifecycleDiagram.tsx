"use client";

import styles from "./Diagrams.module.css";

interface LifecycleDiagramProps {
  steps: string;
  centerText?: string;
}

interface StepData {
  label: string;
}

function parseSteps(input: string): StepData[] {
  return input.split("|").map((s) => ({ label: s.trim() }));
}

export function LifecycleDiagram({ steps, centerText }: LifecycleDiagramProps) {
  const items = steps ? parseSteps(steps) : [];
  const count = items.length;
  if (count === 0) return null;
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 140;
  const nodeW = 110;
  const nodeH = 30;

  const positions = items.map((_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      angle,
    };
  });

  return (
    <div className={styles.lifecycleContainer}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className={styles.lifecycleSvg}
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", maxWidth: "420px", height: "auto" }}
      >
        <defs>
          <marker id="lc-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--color-text-muted)" />
          </marker>
        </defs>

        {/* Arrows between nodes */}
        {positions.map((pos, i) => {
          const next = positions[(i + 1) % count];
          const dx = next.x - pos.x;
          const dy = next.y - pos.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const offsetStart = 58;
          const offsetEnd = 58;
          const x1 = pos.x + (dx / len) * offsetStart;
          const y1 = pos.y + (dy / len) * offsetStart;
          const x2 = next.x - (dx / len) * offsetEnd;
          const y2 = next.y - (dy / len) * offsetEnd;

          return (
            <line
              key={`arrow-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              markerEnd="url(#lc-arrow)"
            />
          );
        })}

        {/* Nodes */}
        {positions.map((pos, i) => {
          const patterns = ["pd-stripe", "pd-dot", "pd-grid", "pd-stripe-rev", "pd-stripe", "pd-dot"];
          const pat = patterns[i % patterns.length];
          const isHighlight = i === count - 1;

          return (
            <g key={`node-${i}`}>
              {/* Node background */}
              <rect
                x={pos.x - nodeW / 2}
                y={pos.y - nodeH / 2}
                width={nodeW}
                height={nodeH}
                fill={isHighlight ? "#5AB55A" : "var(--color-bg-tertiary)"}
                stroke="var(--color-text)"
                strokeWidth="2"
              />
              {/* Pattern overlay */}
              {!isHighlight && (
                <rect
                  x={pos.x - nodeW / 2}
                  y={pos.y - nodeH / 2}
                  width={nodeW}
                  height={nodeH}
                  fill={`url(#${pat})`}
                  stroke="none"
                />
              )}
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fill={isHighlight ? "var(--color-bg)" : "var(--color-text)"}
                fontSize="11"
                fontFamily="var(--font-mono)"
                fontWeight="800"
              >
                {items[i].label}
              </text>
            </g>
          );
        })}

        {/* Center text */}
        {centerText && (
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize="12"
            fontFamily="Comic Sans MS, Segoe Print, cursive"
            fontStyle="italic"
          >
            {centerText}
          </text>
        )}
      </svg>
    </div>
  );
}
