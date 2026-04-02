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
    <div className={styles.hubGrid}>
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

      {/* Row 1: empty | top input | empty | empty */}
      <div className={styles.hubCell} />
      <div className={styles.hubCell}>
        {top && (
          <div className={styles.hubBoxB}>
            <svg className={styles.hubBoxPattern}><rect width="100%" height="100%" fill="url(#hub-dot)" opacity="0.15" /></svg>
            <span className={styles.hubBoxLabel}>{top}</span>
          </div>
        )}
      </div>
      <div className={styles.hubCell} />
      <div className={styles.hubCell} />

      {/* Row 2: empty | arrow down | empty | empty */}
      <div className={styles.hubCell} />
      <div className={styles.hubCellCenter}>
        {top && <span className={styles.hubArrow}>↓</span>}
      </div>
      <div className={styles.hubCell} />
      <div className={styles.hubCell} />

      {/* Row 3: left input | arrow right | center | arrow right | output */}
      <div className={styles.hubCellRight}>
        {left && (
          <>
            <div className={styles.hubBoxA}>
              <svg className={styles.hubBoxPattern}><rect width="100%" height="100%" fill="url(#hub-stripe)" opacity="0.15" /></svg>
              <span className={styles.hubBoxLabel}>{left}</span>
            </div>
            <span className={styles.hubArrow}>→</span>
          </>
        )}
      </div>
      <div className={styles.hubCellCenter}>
        <div className={styles.hubCenterBox}>
          <svg className={styles.hubBoxPattern} xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="url(#hub-grid)" opacity="0.15" />
          </svg>
          <span className={styles.hubCenterLabel}>{center}</span>
        </div>
      </div>
      <div className={styles.hubCellCenter}>
        {right && <span className={styles.hubArrow}>→</span>}
      </div>
      <div className={styles.hubCellLeft}>
        {right && (
          <div className={styles.hubOutputEnd}>
            <div className={styles.hubOutputLabel}>{right}</div>
            {rightSub && <div className={styles.hubOutputSub}>{rightSub}</div>}
          </div>
        )}
      </div>

      {/* Row 4: empty | arrow up | empty | empty */}
      <div className={styles.hubCell} />
      <div className={styles.hubCellCenter}>
        {bottom && <span className={styles.hubArrow}>↑</span>}
      </div>
      <div className={styles.hubCell} />
      <div className={styles.hubCell} />

      {/* Row 5: empty | bottom input | empty | empty */}
      <div className={styles.hubCell} />
      <div className={styles.hubCell}>
        {bottom && (
          <div className={styles.hubBoxA}>
            <svg className={styles.hubBoxPattern}><rect width="100%" height="100%" fill="url(#hub-stripe)" opacity="0.15" /></svg>
            <span className={styles.hubBoxLabel}>{bottom}</span>
          </div>
        )}
      </div>
      <div className={styles.hubCell} />
      <div className={styles.hubCell} />
    </div>
  );
}
