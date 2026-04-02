"use client";

import styles from "./Diagrams.module.css";

interface PipelineColumn {
  label: string;
  items: string[];
  pattern: string;
  annotation?: string;
  annotationPos?: string;
  blocks?: boolean;
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
    const annotationRaw = parts[2]?.trim() || undefined;
    let annotation: string | undefined;
    let annotationPos = "bottom";
    if (annotationRaw) {
      const posMatch = annotationRaw.match(/^\[(left|bottom|top)\]/);
      if (posMatch) {
        annotationPos = posMatch[1];
        annotation = annotationRaw.slice(posMatch[0].length).trim();
      } else {
        annotation = annotationRaw;
      }
    }
    const blocks = label.startsWith("[blocks]");
    const cleanLabel = blocks ? label.replace("[blocks]", "").trim() : label;
    return { label: cleanLabel, items, pattern: PATTERNS[i % PATTERNS.length], annotation, annotationPos, blocks };
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
          {i > 0 && (
            <div className={styles.pipelineArrow}>
              <span>→</span>
              <span>←</span>
            </div>
          )}

          <div className={styles.pipelineBox}>
            <div className={styles.pipelineBoxLabel}>{col.label}</div>
            <div className={styles.pipelineBoxFill}>
              <svg className={styles.pipelineBoxPattern}>
                <rect width="100%" height="100%" fill={`url(#${col.pattern})`} />
              </svg>
            </div>
            {col.blocks ? (
              <div className={styles.pipelineBlocksGrid}>
                {col.items.map((item, j) => (
                  <div key={item} className={styles.pipelineBlock} title={item}>
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`blk-${j}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform={j % 2 === 0 ? "rotate(45)" : undefined}>
                          {j % 3 === 0 && <line x1="0" y1="0" x2="0" y2="5" stroke="var(--color-text)" strokeWidth="1" />}
                          {j % 3 === 1 && <circle cx="2.5" cy="2.5" r="0.8" fill="var(--color-text)" />}
                          {j % 3 === 2 && <><line x1="0" y1="2.5" x2="5" y2="2.5" stroke="var(--color-text)" strokeWidth="0.6" /><line x1="2.5" y1="0" x2="2.5" y2="5" stroke="var(--color-text)" strokeWidth="0.6" /></>}
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#blk-${j})`} opacity="0.3" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.pipelineBoxItems}>
                {col.items.map((item) => (
                  <div key={item} className={styles.pipelineBoxItem}>{item}</div>
                ))}
              </div>
            )}
            {col.annotation && (
              <div className={`${styles.pipelineBoxAnnotation} ${
                col.annotationPos === "left" ? styles.pipelineAnnotationLeft :
                col.annotationPos === "top" ? styles.pipelineAnnotationTop :
                styles.pipelineAnnotationBottom
              }`}>{col.annotation}</div>
            )}
          </div>
        </div>
      ))}

      {endLabel && (
        <div className={styles.pipelineStep}>
          <div className={styles.pipelineArrow}>
            <span>→</span>
          </div>
          <div className={styles.pipelineEnd}>
            <div className={styles.pipelineEndLabel}>{endLabel}</div>
            {endText && <div className={styles.pipelineEndText}>{endText}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
