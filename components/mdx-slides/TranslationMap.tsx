/**
 * <TranslationMap version="1|2|3" />
 *
 * A second evolving artifact alongside <BoundedContextMap />. Appears
 * three times in the talk:
 *
 *   v0.1  after Exhibit A — sparse, just two concepts (person, address)
 *   v0.2  after Exhibit G — adds delivery / bill / reservation / return
 *                             rows + a "Recovered Business Rules" panel
 *   v0.3  Act 3 closing  — adds 'The payment' row + three summary cards
 *                            (5 names · 9 rules · 8 events). The title
 *                            promotes to "The System's Rosetta Stone".
 *
 * The ✅ on a cell marks the system of record for that concept. ⚠
 * marks a cell that's misplaced (e.g. DEL-E011 living in Carrier when
 * it belongs in Returns / Policy).
 */
import styles from "./TranslationMap.module.css";

export type TranslationMapVersion = 1 | 2 | 3;

interface CellValue {
  text: string;
  /** Marks this cell as the system of record (✅) */
  isRecord?: boolean;
  /** Adds a small uppercase warning (⚠) below the cell text */
  warning?: string;
  /** Optional secondary line (e.g. "6 states") */
  sub?: string;
}

type Cell = CellValue | null;

interface Row {
  concept: string;
  /** Cell order: Shipment, Consignee, Carrier, Invoicing, Inventory, Tracking */
  cells: [Cell, Cell, Cell, Cell, Cell, Cell];
}

const SERVICES = [
  "Shipment",
  "Consignee",
  "Carrier",
  "Invoicing",
  "Inventory",
  "Tracking",
];

function buildRows(v: number): Row[] {
  const rows: Row[] = [];

  // v0.1+ baseline. The Person row carries inline (N) field counts so the
  // 'Consignee has 20 fields, everyone else has between 1 and 3' system-
  // of-record signal lands without a separate column.
  rows.push({
    concept: "The person",
    cells: [
      { text: "buyer (3)" },
      { text: "customer (20)", isRecord: true },
      { text: "recipient (3)" },
      { text: "account (3)" },
      { text: "user (1)" },
      { text: "user (2)" },
    ],
  });

  rows.push({
    concept: "The address",
    cells: [
      { text: "Address" },
      { text: "CustomerAddress" },
      { text: "DeliveryAddress" },
      { text: "BillingAddress" },
      null,
      null,
    ],
  });

  // v0.2+ adds entity-ownership rows
  if (v >= 2) {
    rows.push({
      concept: "The delivery",
      cells: [
        { text: "ShipmentInfo", sub: "6 states" },
        null,
        { text: "Shipment", sub: "9 states", isRecord: true },
        null,
        null,
        null,
      ],
    });

    rows.push({
      concept: "The bill",
      cells: [
        { text: "Invoice", sub: "5 states" },
        null,
        null,
        { text: "Invoice", sub: "7 states", isRecord: true },
        null,
        null,
      ],
    });

    rows.push({
      concept: "The reservation",
      cells: [
        null,
        null,
        null,
        null,
        { text: "Reservation", isRecord: true },
        null,
      ],
    });
  }

  // v0.3 adds The payment row (inserted before The return)
  if (v >= 3) {
    rows.push({
      concept: "The payment",
      cells: [
        { text: "paymentStatus" },
        null,
        null,
        { text: "Payment", isRecord: true },
        null,
        null,
      ],
    });
  }

  // The return row — appears at v0.2+. At v0.3 the cell shows the
  // delegation target (→ Returns/Policy).
  if (v >= 2) {
    rows.push({
      concept: "The return",
      cells: [
        null,
        null,
        v >= 3
          ? { text: "→ Returns / Policy", warning: "misplaced (was DEL-E011)" }
          : { text: "DEL-E011", warning: "misplaced" },
        null,
        null,
        null,
      ],
    });
  }

  return rows;
}

interface TitleInfo {
  title: string;
  subtitle: string;
  caption: string;
}

const TITLES: Record<number, TitleInfo> = {
  1: {
    title: "Translation Map v0.1",
    subtitle: "What each context calls the same concept",
    caption: "Translation Map v0.1 — Extracted from 6 API contracts.",
  },
  2: {
    title: "Translation Map v0.2",
    subtitle: "Now with business rules nobody documented",
    caption: "Translation Map v0.2 — Enriched with database, log, and error-code findings.",
  },
  3: {
    title: "The System's Rosetta Stone",
    subtitle:
      "Same concepts. Different names. No translation map existed — until now.",
    caption: "Translation Map — Final. Extracted from 8 exhibits.",
  },
};

interface BusinessRule {
  rule: string;
  value: string;
  code: string;
}

const BUSINESS_RULES: BusinessRule[] = [
  { rule: "Price variance tolerance", value: "2%", code: "ORD-E003" },
  { rule: "Fulfilment SLA", value: "4 hours", code: "ORD-E017" },
  { rule: "Split shipment threshold", value: "3 warehouses", code: "ORD-E031" },
  { rule: "Maximum order cap", value: "€10,000", code: "ORD-E044" },
  { rule: "Return window — electronics", value: "30 days", code: "DEL-E011" },
  { rule: "Return window — clothing", value: "14 days", code: "DEL-E011" },
  { rule: "Return window — perishable", value: "none", code: "DEL-E011" },
  { rule: "Invoice tolerance", value: "€0.01", code: "INV-E001" },
  { rule: "Override / escape hatch", value: "891 / year", code: "ORD-E099" },
];

interface SummaryCard {
  number: string;
  title: string;
  examples: string[];
}

const SUMMARY_CARDS: SummaryCard[] = [
  {
    number: "5",
    title: "names for one person",
    examples: ["buyer", "customer", "recipient", "account", "user"],
  },
  {
    number: "9",
    title: "rules never written down",
    examples: [
      "2% price cap",
      "4h pick SLA",
      "€10k order cap",
      "3-warehouse split trigger",
      "…",
    ],
  },
  {
    // 7 = the fossilized-but-not-declared events the Event Catalog v0.3
    // surfaces (4 from DB timestamps + 3 from log signals). Reconciled
    // with EventCatalog component to match the canonical list:
    //   OrderShipped, OrderDelivered, InvoicePaid, InvoiceIssued
    //   (from DB) + InventoryReserved, InvoiceGenerated, RefundProcessed
    //   (from logs). The 3 still-missing events (ConsigneeRegistered,
    //   AddressChanged, LoyaltyTierUpgraded) are counted separately in
    //   the catalog and don't belong here.
    number: "7",
    title: "events never published",
    examples: [
      "OrderShipped",
      "OrderDelivered",
      "InvoicePaid",
      "InvoiceIssued",
      "InventoryReserved",
      "InvoiceGenerated",
      "RefundProcessed",
    ],
  },
];

interface TranslationMapProps {
  version: TranslationMapVersion | number | string;
}

function parseVersion(raw: string | number): 1 | 2 | 3 {
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > 3) return 3;
  return n as 1 | 2 | 3;
}

export function TranslationMap({ version }: TranslationMapProps) {
  const v = parseVersion(version);
  const t = TITLES[v];
  const rows = buildRows(v);
  const showRules = v >= 2;
  const showSummary = v === 3;
  // v=3 (Rosetta Stone) uses a two-column layout: table + headline
  // summary cards on the left (the artifact + its punchline numbers),
  // rules listing on the right (the deep-dive evidence). This keeps
  // everything visible without clipping at default zoom.
  const twoColumn = v === 3;

  const tableBlock = (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.conceptHeader}>Concept</th>
            {SERVICES.map((s) => (
              <th key={s} className={styles.serviceHeader}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td className={styles.conceptCell}>{row.concept}</td>
              {row.cells.map((cell, ci) => (
                <td key={ci} className={styles.dataCell}>
                  {cell ? (
                    <div
                      className={`${styles.cellContent} ${cell.isRecord ? styles.cellRecord : ""} ${cell.warning ? styles.cellWarning : ""}`}
                    >
                      <div className={styles.cellText}>
                        {cell.text}
                        {cell.isRecord && <span className={styles.recordMark}>  ✅</span>}
                      </div>
                      {cell.sub && <div className={styles.cellSub}>{cell.sub}</div>}
                      {cell.warning && (
                        <div className={styles.warningMark}>⚠ {cell.warning}</div>
                      )}
                    </div>
                  ) : (
                    <span className={styles.emptyDash}>—</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.legend}>
        <span className={styles.recordMark}>✅</span> = system of record for this concept
      </div>
    </>
  );

  const rulesBlock = showRules && (
    <div className={styles.rulesBox}>
      <div className={styles.rulesHeader}>
        Rules found in error codes — never documented
      </div>
      <ul className={styles.rulesList}>
        {BUSINESS_RULES.map((r, i) => (
          <li key={i} className={styles.ruleItem}>
            <span className={styles.ruleName}>{r.rule}</span>
            <span className={styles.ruleValue}>{r.value}</span>
            <span className={styles.ruleCode}>({r.code})</span>
          </li>
        ))}
      </ul>
      <div className={styles.rulesQuote}>
        “These rules ran in production for years. None of them are in any spec.”
      </div>
    </div>
  );

  const summaryBlock = showSummary && (
    <div className={styles.summaryRow}>
      {SUMMARY_CARDS.map((card, i) => (
        <div key={i} className={styles.summaryCard}>
          <div className={styles.summaryNumber}>{card.number}</div>
          <div className={styles.summaryTitle}>{card.title}</div>
          <ul className={styles.summaryList}>
            {card.examples.map((ex, j) => (
              <li key={j}>{ex}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <figure className={styles.figure}>
      {/* No internal title — the slide H2 already carries it. We keep the
          italic subtitle as a one-line orientation under the slide title. */}
      <header className={styles.header}>
        <div className={styles.subtitle}>{t.subtitle}</div>
      </header>

      {twoColumn ? (
        <>
          {/* The 7-row × 7-col table needs full width to stay readable
              — sharing a row with anything else clips columns. */}
          {tableBlock}
          {/* Findings split into two columns BELOW the table: rules
              listing on the left, three summary cards stacked on the
              right. */}
          <div className={styles.twoColumn}>
            <div className={styles.colLeft}>
              {rulesBlock}
            </div>
            <div className={styles.colRight}>
              {summaryBlock}
            </div>
          </div>
        </>
      ) : (
        <>
          {tableBlock}
          {rulesBlock}
          {summaryBlock}
        </>
      )}
    </figure>
  );
}
