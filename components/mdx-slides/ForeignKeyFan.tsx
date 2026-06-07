/**
 * <ForeignKeyFan
 *    sourceTable="orders"
 *    sourceLabel="31 cols"
 *    targets="customers::Consignee|warehouses::Inventory|carriers::Carrier|invoices::Invoicing"
 *    fkCount="4 FKs"
 *    caption="…"
 * />
 *
 * Mirror image of <WriteConflictDiagram />: one source table at the top
 * with N cross-boundary foreign keys fanning OUT to other services'
 * tables.  Designed for the Exhibit B "Look at table structure" slide
 * where the orders table has FKs to customers / warehouses / carriers
 * / invoices.
 *
 * Targets format: pipe-separated entries; each entry is
 * "table_name::owning_service".
 */
import styles from "./ForeignKeyFan.module.css";

interface ForeignKeyFanProps {
  /** Source table (the one with the FKs). */
  sourceTable: string;
  /** Optional short label below the source name (e.g. "31 cols"). */
  sourceLabel?: string;
  /**
   * Pipe-separated targets. Each entry is "table::service" where
   * `table` is the referenced table and `service` is the owning
   * bounded context.
   */
  targets: string;
  /** Optional label rendered next to the trunk arrow (e.g. "4 FKs"). */
  fkCount?: string;
  /** Optional one-line caption rendered below the fan. */
  caption?: string;
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
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
  );
}

export function ForeignKeyFan({
  sourceTable,
  sourceLabel,
  targets,
  fkCount,
  caption,
}: ForeignKeyFanProps) {
  const targetList = targets.split("|").map((entry) => {
    const [table, service] = entry.split("::").map((s) => s.trim());
    return { table: table ?? "", service: service ?? "" };
  });

  return (
    <figure className={styles.figure}>
      <div className={styles.sourceBox}>
        <div className={styles.sourceRow}>
          <DatabaseIcon className={styles.sourceIcon} />
          <span className={styles.sourceName}>{sourceTable}</span>
        </div>
        {sourceLabel && (
          <div className={styles.sourceLabel}>{sourceLabel}</div>
        )}
      </div>

      <div className={styles.trunkRow}>
        <span className={styles.trunkArrow}>↓</span>
        {fkCount && <span className={styles.trunkLabel}>{fkCount}</span>}
      </div>

      <div className={styles.targetRow}>
        {targetList.map((t, i) => (
          <div key={i} className={styles.targetBox}>
            <div className={styles.targetTableRow}>
              <DatabaseIcon className={styles.targetIcon} />
              <span className={styles.targetTable}>{t.table}</span>
            </div>
            <div className={styles.targetService}>{t.service}</div>
          </div>
        ))}
      </div>

      {caption && <div className={styles.caption}>{caption}</div>}
    </figure>
  );
}
