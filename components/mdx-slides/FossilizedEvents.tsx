/**
 * <FossilizedEvents
 *    table="orders"
 *    mappings="confirmed_at::OrderConfirmed|shipped_at::OrderShipped|…"
 *    punchline="5 Domain Events. Recorded for years. Never announced."
 * />
 *
 * Compact visual for the "transactions reveal domain events" moment
 * on Exhibit C. Each row shows:
 *
 *   🗄  table.column   →   EventName         ⊗ never published
 *
 * Designed to replace text-heavy callouts that pile up multiple
 * timestamp -> event mappings as bulleted prose. The audience reads
 * the column on the right and gets "five fossilised events" in one
 * glance.
 */
import styles from "./FossilizedEvents.module.css";

interface FossilizedEventsProps {
  /** Source table the timestamp columns live in (e.g. "orders"). */
  table: string;
  /**
   * Pipe-separated mappings. Each entry is `column::event_name`.
   * Optionally append `::badge` for a non-default right-side marker.
   */
  mappings: string;
  /** Optional bold punch-line below the list. */
  punchline?: string;
  /** Optional small subtitle below the punch-line (italic). */
  followup?: string;
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

export function FossilizedEvents({
  table,
  mappings,
  punchline,
  followup,
}: FossilizedEventsProps) {
  const rows = mappings.split("|").map((entry) => {
    const parts = entry.split("::").map((s) => s.trim());
    return {
      column: parts[0] ?? "",
      event: parts[1] ?? "",
      badge: parts[2] ?? "never published",
    };
  });

  return (
    <figure className={styles.figure}>
      <div className={styles.headerRow}>
        <div className={styles.tableHeader}>
          <DatabaseIcon className={styles.tableIcon} />
          <span className={styles.tableName}>{table}</span>
        </div>
        <span className={styles.fossilLabel}>fossilised · db</span>
      </div>

      <div className={styles.list}>
        {rows.map((r, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.column}>{r.column}</span>
            <span className={styles.arrow}>→</span>
            <span className={styles.event}>{r.event}</span>
            <span className={styles.badge}>⊗ {r.badge}</span>
          </div>
        ))}
      </div>

      {punchline && <div className={styles.punchline}>{punchline}</div>}
      {followup && <div className={styles.followup}>{followup}</div>}
    </figure>
  );
}
