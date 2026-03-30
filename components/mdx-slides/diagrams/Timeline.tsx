"use client";

import styles from "./Diagrams.module.css";

interface TimelineProps {
  points: string;
}

interface TimelinePoint {
  year: string;
  top: string;
  bottom: string;
  highlight: boolean;
}

function parsePoints(input: string): TimelinePoint[] {
  return input.split("|").map((entry) => {
    const parts = entry.trim().split("::");
    return {
      year: parts[0]?.trim() || "",
      top: parts[1]?.trim() || "",
      bottom: parts[2]?.trim() || "",
      highlight: parts[3]?.trim() === "highlight",
    };
  });
}

export function Timeline({ points }: TimelineProps) {
  const items = parsePoints(points);

  const colStyle = { "--timeline-cols": items.length } as React.CSSProperties;

  return (
    <div className={styles.timelineHContainer} style={colStyle}>
      {/* Top texts */}
      <div className={styles.timelineHRow}>
        {items.map((item) => (
          <div key={`top-${item.year}`} className={`${styles.timelineHTop} ${item.highlight ? styles.timelineHHighlight : ""}`}>
            {item.top}
          </div>
        ))}
      </div>

      {/* Line with dots */}
      <div className={styles.timelineHLineRow}>
        <div className={styles.timelineHLine} />
        <div className={styles.timelineHDots}>
          {items.map((item) => (
            <div key={`dot-${item.year}`} className={styles.timelineHDotWrap}>
              <div className={`${styles.timelineHDot} ${item.highlight ? styles.timelineHDotHighlight : ""}`} />
              <div className={`${styles.timelineHYear} ${item.highlight ? styles.timelineHHighlight : ""}`}>{item.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom texts */}
      <div className={styles.timelineHRow}>
        {items.map((item) => (
          <div key={`bot-${item.year}`} className={styles.timelineHBottom}>
            {item.bottom}
          </div>
        ))}
      </div>
    </div>
  );
}
