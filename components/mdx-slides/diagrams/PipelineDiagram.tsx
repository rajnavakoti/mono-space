"use client";

import styles from "./Diagrams.module.css";

interface PipelineColumn {
  label: string;
  items: string[];
  pattern: string;
}

interface PipelineDiagramProps {
  columns: string;
  endLabel?: string;
  endText?: string;
}

const PATTERNS = ["pd-stripe", "pd-dot", "pd-grid", "pd-stripe-rev"];

function parseColumns(input: string): PipelineColumn[] {
  return input.split("||").map((col, i) => {
    const parts = col.trim().split("::");
    const label = parts[0]?.trim() || "";
    const items = parts[1]?.trim().split(",").map((s) => s.trim()) || [];
    return { label, items, pattern: PATTERNS[i % PATTERNS.length] };
  });
}

export function PipelineDiagram({ columns, endLabel, endText }: PipelineDiagramProps) {
  const cols = parseColumns(columns);

  return (
    <div className={styles.pipelineContainer}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <pattern id="pd-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-text)" strokeWidth="1" />
          </pattern>
          <pattern id="pd-dot" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1" fill="var(--color-text)" />
          </pattern>
          <pattern id="pd-grid" width="7" height="7" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3.5" x2="7" y2="3.5" stroke="var(--color-text)" strokeWidth="0.8" />
            <line x1="3.5" y1="0" x2="3.5" y2="7" stroke="var(--color-text)" strokeWidth="0.8" />
          </pattern>
          <pattern id="pd-stripe-rev" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-text)" strokeWidth="1" />
          </pattern>
        </defs>
      </svg>

      {cols.map((col, i) => (
        <div key={col.label} className={styles.pipelineStep}>
          {/* Arrow before (except first) */}
          {i > 0 && <div className={styles.pipelineArrow}>→</div>}

          {/* Column box */}
          <div className={styles.pipelineBox}>
            <div className={styles.pipelineBoxLabel}>{col.label}</div>
            <div className={styles.pipelineBoxFill}>
              <svg className={styles.pipelineBoxPattern}>
                <rect width="100%" height="100%" fill={`url(#${col.pattern})`} />
              </svg>
            </div>
            <div className={styles.pipelineBoxItems}>
              {col.items.map((item) => (
                <div key={item} className={styles.pipelineBoxItem}>{item}</div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* End: ROI */}
      {endLabel && (
        <div className={styles.pipelineStep}>
          <div className={styles.pipelineArrow}>→</div>
          <div className={styles.pipelineEnd}>
            <div className={styles.pipelineEndLabel}>{endLabel}</div>
            {endText && <div className={styles.pipelineEndText}>{endText}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
