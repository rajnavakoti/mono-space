"use client";

import styles from "./Diagrams.module.css";

interface LifecycleNode {
  label: string;
  color?: string;
}

interface LifecycleDiagramProps {
  nodes: LifecycleNode[];
  centerText?: string;
}

export function LifecycleDiagram({ nodes, centerText }: LifecycleDiagramProps) {
  const count = nodes.length;
  const radius = 140;
  const centerX = 180;
  const centerY = 170;

  const positions = nodes.map((_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className={styles.lifecycleContainer}>
      <svg
        viewBox="0 0 360 340"
        className={styles.lifecycleSvg}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--color-text-muted)"
            />
          </marker>
        </defs>

        {positions.map((pos, i) => {
          const next = positions[(i + 1) % count];
          const dx = next.x - pos.x;
          const dy = next.y - pos.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const offsetStart = 40;
          const offsetEnd = 40;
          return (
            <line
              key={`arrow-${i}`}
              x1={pos.x + (dx / len) * offsetStart}
              y1={pos.y + (dy / len) * offsetStart}
              x2={next.x - (dx / len) * offsetEnd}
              y2={next.y - (dy / len) * offsetEnd}
              stroke="var(--color-text-muted)"
              strokeWidth="2.5"
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {positions.map((pos, i) => {
          const node = nodes[i];
          return (
            <g key={`node-${i}`}>
              <rect
                x={pos.x - 48}
                y={pos.y - 16}
                width="96"
                height="32"
                fill="var(--color-bg)"
                stroke={node.color || "var(--color-border-heavy)"}
                strokeWidth="2.5"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fill="var(--color-text)"
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight="700"
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {centerText && (
          <text
            x={centerX}
            y={centerY + 4}
            textAnchor="middle"
            fill="var(--color-text-muted)"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {centerText}
          </text>
        )}
      </svg>
    </div>
  );
}
