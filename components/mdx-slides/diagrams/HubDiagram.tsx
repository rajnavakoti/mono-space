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
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <pattern id="hub-stripe" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--color-text)" strokeWidth="1" />
          </pattern>
          <pattern id="hub-dot" width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1" fill="var(--color-text)" />
          </pattern>
          <pattern id="hub-grid" width="7" height="7" patternUnits="userSpaceOnUse">
            <line x1="0" y1="3.5" x2="7" y2="3.5" stroke="var(--color-text)" strokeWidth="0.8" />
            <line x1="3.5" y1="0" x2="3.5" y2="7" stroke="var(--color-text)" strokeWidth="0.8" />
          </pattern>
        </defs>
      </svg>

      {/* Middle row: left → center column (with top/bottom) → right */}
      <div className={styles.hubMiddle}>
        {/* Left input */}
        {left && (
          <>
            <div className={styles.hubInputBoxA}>
              <svg className={styles.hubInputPattern}><rect width="100%" height="100%" fill="url(#hub-stripe)" opacity="0.15" /></svg>
              <span className={styles.hubInputLabel}>{left}</span>
            </div>
            <div className={styles.hubArrowRight}>→</div>
          </>
        )}

        {/* Center column: top + center + bottom stacked */}
        <div className={styles.hubCenterColumn}>
          {top && (
            <>
              <div className={styles.hubInputBoxB}>
                <svg className={styles.hubInputPattern}><rect width="100%" height="100%" fill="url(#hub-dot)" opacity="0.15" /></svg>
                <span className={styles.hubInputLabel}>{top}</span>
              </div>
              <div className={styles.hubArrowDown}>↓</div>
            </>
          )}

          <div className={styles.hubCenterBox}>
            <svg className={styles.hubCenterPattern} xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="url(#hub-grid)" opacity="0.15" />
            </svg>
            <span className={styles.hubCenterLabel}>{center}</span>
          </div>

          {bottom && (
            <>
              <div className={styles.hubArrowUp}>↑</div>
              <div className={styles.hubInputBoxA}>
                <svg className={styles.hubInputPattern}><rect width="100%" height="100%" fill="url(#hub-stripe)" opacity="0.15" /></svg>
                <span className={styles.hubInputLabel}>{bottom}</span>
              </div>
            </>
          )}
        </div>

        {/* Right output */}
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
    </div>
  );
}
