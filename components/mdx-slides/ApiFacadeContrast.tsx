/**
 * <ApiFacadeContrast
 *    consumers="A|B|C"
 *    apiLabel="Consignee API"
 *    tableLabel="customer_addresses"
 *    declaredVerdict="✓ clean boundary"
 *    actualVerdict="⚠ 3 Conformists · facade"
 * />
 *
 * Two side-by-side mini-diagrams for the Exhibit B "Check if API
 * boundaries match DB access" slide:
 *
 *   LEFT  — DECLARED (what the contracts said): consumers reach the
 *           service via its API; the API protects the table.
 *   RIGHT — ACTUAL   (what the database shows): consumers bypass the
 *           API and read the table directly — the API is a facade.
 *
 * Each panel renders the same set of consumers and the same target
 * table. The difference is the flow: arrows hit the API box on the
 * left; arrows skip past it on the right. The audience reads the
 * contradiction in 2 seconds, no prose required.
 */
import styles from "./ApiFacadeContrast.module.css";

interface ApiFacadeContrastProps {
  /**
   * Pipe-separated consumer names for the DECLARED panel (what the
   * contracts say). Falls back to `consumers` if not provided so older
   * slide markup keeps working.
   */
  declaredConsumers?: string;
  /**
   * Pipe-separated consumer names for the ACTUAL panel (what the
   * database shows). Often a SUBSET of declaredConsumers — the
   * services that actually bypass the API.
   */
  actualConsumers?: string;
  /**
   * Legacy single-list prop. If `declaredConsumers` and
   * `actualConsumers` are both unset, both panels use this list.
   */
  consumers?: string;
  /** Label for the API box in the middle (left panel only). */
  apiLabel: string;
  /** Label for the database table at the bottom. */
  tableLabel: string;
  /** Optional verdict line at the bottom of the LEFT panel. */
  declaredVerdict?: string;
  /** Optional verdict line at the bottom of the RIGHT panel. */
  actualVerdict?: string;
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

interface PanelProps {
  label: string;
  consumers: string[];
  apiLabel?: string;
  tableLabel: string;
  verdict?: string;
  variant: "declared" | "actual";
}

function Panel({
  label,
  consumers,
  apiLabel,
  tableLabel,
  verdict,
  variant,
}: PanelProps) {
  return (
    <div
      className={`${styles.panel} ${variant === "actual" ? styles.panelActual : ""}`}
    >
      <div className={styles.panelLabel}>{label}</div>

      {/* Each consumer is a vertical column = box on top, arrow below.
          That way 3 and 5 consumers both align under their own arrow
          without hard-coding a width-per-arrow calc. */}
      <div className={styles.consumerGrid}>
        {consumers.map((c, i) => (
          <div key={i} className={styles.consumerColumn}>
            <div className={styles.consumerBox}>{c}</div>
            <span className={styles.arrow}>↓</span>
          </div>
        ))}
      </div>

      {variant === "declared" && apiLabel && (
        <>
          <div className={styles.apiBox}>{apiLabel}</div>
          <div className={styles.singleArrow}>↓</div>
        </>
      )}

      <div
        className={`${styles.tableBox} ${variant === "actual" ? styles.tableBoxActual : ""}`}
      >
        <DatabaseIcon className={styles.tableIcon} />
        <span className={styles.tableName}>{tableLabel}</span>
      </div>

      {verdict && (
        <div
          className={`${styles.verdict} ${variant === "actual" ? styles.verdictActual : styles.verdictDeclared}`}
        >
          {verdict}
        </div>
      )}
    </div>
  );
}

export function ApiFacadeContrast({
  declaredConsumers,
  actualConsumers,
  consumers,
  apiLabel,
  tableLabel,
  declaredVerdict,
  actualVerdict,
}: ApiFacadeContrastProps) {
  const parse = (raw?: string) =>
    raw ? raw.split("|").map((c) => c.trim()) : [];

  const declaredList = parse(declaredConsumers ?? consumers);
  const actualList = parse(actualConsumers ?? consumers);

  return (
    <figure className={styles.figure}>
      <Panel
        label="DECLARED · contracts"
        consumers={declaredList}
        apiLabel={apiLabel}
        tableLabel={tableLabel}
        verdict={declaredVerdict}
        variant="declared"
      />
      <Panel
        label="ACTUAL · database"
        consumers={actualList}
        tableLabel={tableLabel}
        verdict={actualVerdict}
        variant="actual"
      />
    </figure>
  );
}
