"use client";

import styles from "./Diagrams.module.css";

interface HubDiagramProps {
  center: string;
  left?: string;
  top?: string;
  bottom?: string;
  right?: string;
  rightSub?: string;
}

export function HubDiagram({ center, left, top, bottom, right, rightSub }: HubDiagramProps) {
  return (
    <div className={styles.hubContainer}>
      {/* Top input */}
      {top && (
        <div className={styles.hubTop}>
          <div className={styles.hubInputBox}>{top}</div>
          <div className={styles.hubArrowDown}>↓</div>
        </div>
      )}

      {/* Middle row: left → center → right */}
      <div className={styles.hubMiddle}>
        {left && (
          <>
            <div className={styles.hubInputBox}>{left}</div>
            <div className={styles.hubArrowRight}>→</div>
          </>
        )}

        <div className={styles.hubCenterBox}>
          <svg className={styles.hubCenterPattern} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hub-grid" width="7" height="7" patternUnits="userSpaceOnUse">
                <line x1="0" y1="3.5" x2="7" y2="3.5" stroke="var(--color-text)" strokeWidth="0.8" />
                <line x1="3.5" y1="0" x2="3.5" y2="7" stroke="var(--color-text)" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hub-grid)" opacity="0.15" />
          </svg>
          <span className={styles.hubCenterLabel}>{center}</span>
        </div>

        {right && (
          <>
            <div className={styles.hubArrowRight}>→</div>
            <div className={styles.hubOutputEnd}>
              <div className={styles.hubOutputLabel}>{right}</div>
              {rightSub && <div className={styles.hubOutputSub}>{rightSub}</div>}
            </div>
          </>
        )}
      </div>

      {/* Bottom input */}
      {bottom && (
        <div className={styles.hubBottom}>
          <div className={styles.hubArrowUp}>↑</div>
          <div className={styles.hubInputBox}>{bottom}</div>
        </div>
      )}
    </div>
  );
}
