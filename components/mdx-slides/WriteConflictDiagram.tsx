/**
 * <WriteConflictDiagram writers="…|…" table="…" badge="…" caption="…" />
 *
 * ERD-style visual for the Exhibit B "Find tables with multiple writers"
 * moment: two (or more) service boxes at the top, each with a "writes"
 * arrow pointing down to a single shared-table box, plus an optional
 * badge inside the table box (e.g. "⚠ 2 WRITERS") and a caption below.
 *
 * Designed for the inventory_reserved disputed-Aggregate visual:
 *
 *   <WriteConflictDiagram
 *     writers="Shipment Service|Inventory Service"
 *     table="inventory_reserved"
 *     badge="⚠ 2 WRITERS · disputed Aggregate"
 *     caption="Both services believe they own the Reservation Aggregate."
 *   />
 */
import styles from "./WriteConflictDiagram.module.css";

interface WriteConflictDiagramProps {
  /** Pipe-separated writer/service names. */
  writers: string;
  /** The shared table being written to. */
  table: string;
  /** Optional badge text inside the table box (e.g. "⚠ 2 WRITERS"). */
  badge?: string;
  /** Optional one-line caption rendered below the diagram. */
  caption?: string;
}

export function WriteConflictDiagram({
  writers,
  table,
  badge,
  caption,
}: WriteConflictDiagramProps) {
  const writerList = writers.split("|").map((w) => w.trim());

  return (
    <figure className={styles.figure}>
      <div className={styles.writerRow}>
        {writerList.map((w, i) => (
          <div key={i} className={styles.writerBox}>
            {w}
          </div>
        ))}
      </div>
      <div className={styles.arrowRow}>
        {writerList.map((_, i) => (
          <div key={i} className={styles.arrowCell}>
            <span className={styles.arrowLabel}>writes</span>
            <span className={styles.arrowGlyph}>↓</span>
          </div>
        ))}
      </div>
      <div className={styles.tableBox}>
        <div className={styles.tableNameRow}>
          {/* Small cylinder database icon — stroked, no fill, so it
              picks up the surrounding color via currentColor. */}
          <svg
            className={styles.tableIcon}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <ellipse
              cx="12"
              cy="5"
              rx="9"
              ry="2.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M3 5 L3 19 A9 2.5 0 0 0 21 19 L21 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M3 12 A9 2.5 0 0 0 21 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          <span className={styles.tableName}>{table}</span>
        </div>
        {badge && <div className={styles.badge}>{badge}</div>}
      </div>
      {caption && <div className={styles.caption}>{caption}</div>}
    </figure>
  );
}
