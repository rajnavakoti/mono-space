/**
 * <RuntimeFlow
 *    syncChain="Shipment|Inventory|Shipment|Invoicing|Tracking"
 *    syncDurationLabel="2 seconds"
 *    syncVerdict="🔴 extraction blocker"
 *    asyncFrom="Invoicing"
 *    asyncTo="Carrier"
 *    asyncGapLabel="87 seconds"
 *    asyncVerdict="🟢 natural boundary"
 * />
 *
 * Two-panel visual for the Exhibit D "Identify sync chains and async
 * boundaries" slide. Left panel: a horizontal chain of service blocks
 * joined by red arrows (each step waits on the previous). Right panel:
 * one upstream service, an explicit gap visualisation, then the
 * downstream service — decoupled by a queue or poll.
 */
import styles from "./RuntimeFlow.module.css";

interface RuntimeFlowProps {
  /** Pipe-separated services in the sync chain (in order). */
  syncChain: string;
  /** Label for the sync-chain duration (e.g. "2 seconds"). */
  syncDurationLabel?: string;
  /** Verdict line below the sync chain (e.g. "🔴 extraction blocker"). */
  syncVerdict?: string;
  /** Upstream service before the async gap. */
  asyncFrom: string;
  /** Downstream service after the async gap. */
  asyncTo: string;
  /** Label for the async gap (e.g. "87 seconds"). */
  asyncGapLabel?: string;
  /** Verdict line below the async pair (e.g. "🟢 natural boundary"). */
  asyncVerdict?: string;
}

export function RuntimeFlow({
  syncChain,
  syncDurationLabel,
  syncVerdict,
  asyncFrom,
  asyncTo,
  asyncGapLabel,
  asyncVerdict,
}: RuntimeFlowProps) {
  const syncList = syncChain.split("|").map((s) => s.trim());

  return (
    <figure className={styles.figure}>
      {/* SYNC chain — services in a row, red arrows between each. */}
      <div className={`${styles.panel} ${styles.panelSync}`}>
        <div className={styles.panelLabel}>SYNC chain</div>
        <div className={styles.chain}>
          {syncList.map((s, i) => (
            <span key={i} className={styles.chainGroup}>
              <span className={styles.box}>{s}</span>
              {i < syncList.length - 1 && (
                <span className={styles.syncArrow}>→</span>
              )}
            </span>
          ))}
        </div>
        {syncDurationLabel && (
          <div className={styles.durationLabel}>
            <span className={styles.durationNumber}>{syncDurationLabel}</span>
            <span className={styles.durationCaption}>
              each step waits on the previous
            </span>
          </div>
        )}
        {syncVerdict && (
          <div className={`${styles.verdict} ${styles.verdictRed}`}>
            {syncVerdict}
          </div>
        )}
      </div>

      {/* ASYNC gap — upstream box, dotted/dashed long arrow, downstream box. */}
      <div className={`${styles.panel} ${styles.panelAsync}`}>
        <div className={styles.panelLabel}>ASYNC gap</div>
        <div className={styles.chain}>
          <span className={styles.box}>{asyncFrom}</span>
          <span className={styles.asyncArrow}>
            <span className={styles.asyncDots}>· · · · · · · · ·</span>
            {asyncGapLabel && (
              <span className={styles.asyncGapLabel}>{asyncGapLabel}</span>
            )}
            <span className={styles.asyncArrowHead}>→</span>
          </span>
          <span className={styles.box}>{asyncTo}</span>
        </div>
        {asyncVerdict && (
          <div className={`${styles.verdict} ${styles.verdictGreen}`}>
            {asyncVerdict}
          </div>
        )}
      </div>
    </figure>
  );
}
