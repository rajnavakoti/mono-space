/**
 * <EventCatalog version="1|2|3" />
 *
 * Third evolving artifact alongside <BoundedContextMap /> and
 * <TranslationMap />. Appears at three points in the talk:
 *
 *   v0.1  after Exhibit A — what services chose to announce
 *                            (13 declared, 4 silent)
 *   v0.2  after Exhibit C — adds fossilised events from DB
 *                            timestamps (built in C/D pass)
 *   v0.3  after Exhibit D — final: 22 events, 9 never published,
 *                            3 that should exist but don't
 *                            (built in C/D pass)
 *
 * Only v0.1 data is shipped today. v0.2 and v0.3 land when we
 * rework Exhibits C and D — they extend EXHIBIT_A_DEFAULTS with
 * fossilised + missing events.
 */
import styles from "./EventCatalog.module.css";

export type EventCatalogVersion = 1 | 2 | 3;

interface DeclaredDomain {
  domain: string;
  events: string[];
}

interface FossilizedEvent {
  /** The DB column or log signal that surfaced it (e.g. 'confirmed_at') */
  source: string;
  /** The DDD event name it implies (e.g. 'OrderConfirmed') */
  event: string;
  /** Owning table for grouping (e.g. 'orders', 'invoices') */
  table: string;
  /** Optional annotation, e.g. 'Invoicing tracks internally' */
  flag?: string;
}

interface CatalogData {
  declared: DeclaredDomain[];
  silent: string[];
  /** v0.2+ — events surfaced from sources other than contracts (DB / logs). */
  fossilized?: FossilizedEvent[];
  /** v0.2+ — domain events the activity suspects should exist but no
   *  evidence yet supports. */
  stillMissing?: string[];
}

interface TitleInfo {
  title: string;
  subtitle: string;
}

const TITLES: Record<number, TitleInfo> = {
  1: {
    title: "Event Catalog v0.1",
    subtitle: "What services chose to announce",
  },
  2: {
    title: "Event Catalog v0.2",
    subtitle: "What the database tracks but never publishes",
  },
  3: {
    title: "Event Catalog v0.3 — Final",
    subtitle:
      "22 events. 9 the system never published. 3 that should exist but don't.",
  },
};

// 13 events total — aligned with the canonical list used by
// <TranslationMap /> and <ContractYield />. The slides-exhibits-ABCD.md
// section for A.10 lists only 11 (missing OrderLineAdded and
// ShipmentOutForDelivery) but the explicit '13 declared' count is the
// reference; the listing there is incomplete.
const EXHIBIT_A_DEFAULTS: CatalogData = {
  declared: [
    {
      domain: "Shipment Domain",
      events: [
        "OrderPlaced",
        "OrderConfirmed",
        "OrderCancelled",
        "OrderLineAdded",
        "FulfillmentStarted",
        "OrderCompleted",
      ],
    },
    {
      domain: "Carrier Domain",
      events: [
        "ShipmentCreated",
        "ShipmentPickedUp",
        "ShipmentInTransit",
        "ShipmentOutForDelivery",
        "ShipmentDelivered",
        "ShipmentFailed",
        "ShipmentReturned",
      ],
    },
  ],
  silent: ["Consignee", "Invoicing", "Inventory", "Tracking"],
};

// v0.2 = Exhibit C extends v0.1 with DB-fossilized events. Invoicing
// drops out of the silent list because the DB surfaces 2 events for it
// (paid_at, issued_at) even though its contracts declared none.
const EXHIBIT_C_DEFAULTS: CatalogData = {
  declared: EXHIBIT_A_DEFAULTS.declared,
  silent: ["Consignee", "Inventory", "Tracking"],
  fossilized: [
    { source: "confirmed_at", event: "OrderConfirmed", table: "orders" },
    { source: "shipped_at", event: "OrderShipped", table: "orders" },
    { source: "delivered_at", event: "OrderDelivered", table: "orders" },
    { source: "cancelled_at", event: "OrderCancelled", table: "orders" },
    {
      source: "paid_at",
      event: "InvoicePaid",
      table: "invoices",
      flag: "Invoicing declared 0 events — but tracks this",
    },
    {
      source: "issued_at",
      event: "InvoiceIssued",
      table: "invoices",
      flag: "Invoicing declared 0 events — but tracks this",
    },
  ],
  stillMissing: [
    "ConsigneeRegistered",
    "AddressChanged",
    "LoyaltyTierUpgraded",
    "InventoryReserved",
  ],
};

// v0.3 = Exhibit D adds 3 more fossilized events from production logs.
// InventoryReserved (was missing at v0.2) is now found in logs and moves
// out of stillMissing. Inventory + Tracking + Invoicing all surface at
// least one event somewhere — only Consignee remains fully silent in
// domain-event terms.
const EXHIBIT_D_DEFAULTS: CatalogData = {
  declared: EXHIBIT_A_DEFAULTS.declared,
  silent: ["Consignee"],
  fossilized: [
    // From C — DB timestamps (6 events, carry forward)
    { source: "confirmed_at", event: "OrderConfirmed", table: "orders" },
    { source: "shipped_at", event: "OrderShipped", table: "orders" },
    { source: "delivered_at", event: "OrderDelivered", table: "orders" },
    { source: "cancelled_at", event: "OrderCancelled", table: "orders" },
    {
      source: "paid_at",
      event: "InvoicePaid",
      table: "invoices",
      flag: "Invoicing declared 0 events — but tracks this",
    },
    {
      source: "issued_at",
      event: "InvoiceIssued",
      table: "invoices",
      flag: "Invoicing declared 0 events — but tracks this",
    },
    // NEW from D — log signals (3 events). The synthetic 'logs · new
    // from D' table name groups these into a separate sub-section in
    // the fossilized renderer.
    {
      source: "11,891 / day",
      event: "InventoryReserved",
      table: "logs · new from D",
    },
    {
      source: "11,402 / day",
      event: "InvoiceGenerated",
      table: "logs · new from D",
      flag: "Invoicing logs every invoice — and tells nobody",
    },
    {
      source: "156 / day",
      event: "RefundProcessed",
      table: "logs · new from D",
    },
  ],
  stillMissing: [
    "ConsigneeRegistered",
    "AddressChanged",
    "LoyaltyTierUpgraded",
  ],
};

interface EventCatalogProps {
  version?: EventCatalogVersion | number | string;
}

function parseVersion(raw: string | number | undefined): 1 | 2 | 3 {
  if (raw === undefined) return 1;
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  if (n > 3) return 3;
  return n as 1 | 2 | 3;
}

export function EventCatalog({ version }: EventCatalogProps = {}) {
  const v = parseVersion(version);
  const t = TITLES[v];
  // v0.1 = Exhibit A baseline; v0.2 = Exhibit C adds DB-fossilised; v0.3 =
  // Exhibit D adds log-fossilised + drops events from the stillMissing list
  // that the logs surfaced.
  const data =
    v === 1
      ? EXHIBIT_A_DEFAULTS
      : v === 2
        ? EXHIBIT_C_DEFAULTS
        : EXHIBIT_D_DEFAULTS;
  const declaredCount = data.declared.reduce(
    (n, d) => n + d.events.length,
    0,
  );
  const fossilizedByTable = (data.fossilized ?? []).reduce<
    Record<string, FossilizedEvent[]>
  >((acc, f) => {
    (acc[f.table] ??= []).push(f);
    return acc;
  }, {});

  // v=3 (Exhibit D final) renders FOUR sections — declared / silent /
  // fossilized / missing — and the default vertical stack runs off the
  // bottom of the slide. Switch to a two-column primary layout: declared
  // on the LEFT (the biggest section), and silent + fossilized + missing
  // stacked on the RIGHT.
  const useTwoColumn = v === 3;

  const declaredSection = (
    <section className={styles.declared}>
      <header className={styles.sectionHeader}>
        <span className={`${styles.sectionCount} ${styles.countDeclared}`}>
          {declaredCount}
        </span>
        <span className={styles.sectionLabel}>declared</span>
      </header>
      {data.declared.map((d) => (
        <div key={d.domain} className={styles.domainBlock}>
          <div className={styles.domainName}>
            {d.domain}
            <span className={styles.domainCount}>({d.events.length})</span>
          </div>
          <ul className={styles.eventList}>
            {d.events.map((e) => (
              <li key={e} className={styles.eventItem}>{e}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );

  const silentSection = (
    <section className={styles.silent}>
      <header className={styles.sectionHeader}>
        <span className={`${styles.sectionCount} ${styles.countSilent}`}>
          {data.silent.length}
        </span>
        <span className={styles.sectionLabel}>silent · 0 events each</span>
      </header>
      <ul className={styles.silentList}>
        {data.silent.map((s) => (
          <li key={s} className={styles.silentItem}>{s}</li>
        ))}
      </ul>
    </section>
  );

  const fossilizedSection = data.fossilized && data.fossilized.length > 0 && (
    <section className={styles.fossilized}>
      <header className={styles.sectionHeader}>
        <span className={`${styles.sectionCount} ${styles.countFossilized}`}>
          {data.fossilized.length}
        </span>
        <span className={styles.sectionLabel}>
          fossilized ·{" "}
          {v === 2
            ? "new from Exhibit C"
            : "system records, never publishes"}
        </span>
      </header>
      <div className={styles.fossilizedGroups}>
        {Object.entries(fossilizedByTable).map(([table, events]) => (
          <div key={table} className={styles.fossilizedGroup}>
            <div className={styles.fossilizedGroupHeader}>
              From <code>{table}</code>:
            </div>
            <ul className={styles.fossilizedList}>
              {events.map((f) => (
                <li key={f.source} className={styles.fossilizedItem}>
                  <code className={styles.fossilizedSource}>{f.source}</code>
                  <span className={styles.fossilizedArrow}>→</span>
                  <span className={styles.fossilizedEvent}>{f.event}</span>
                  {f.flag && (
                    <span className={styles.fossilizedFlag}>⚠ {f.flag}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );

  const missingSection = data.stillMissing && data.stillMissing.length > 0 && (
    <section className={styles.missing}>
      <span className={styles.missingHeader}>
        <strong>{data.stillMissing.length} events</strong> we still have no evidence for:
      </span>
      <span className={styles.missingList}>
        {data.stillMissing.join(" · ")}
      </span>
    </section>
  );

  if (useTwoColumn) {
    return (
      <figure className={styles.figure}>
        <header className={styles.header}>
          <div className={styles.title}>{t.title}</div>
          <div className={styles.subtitle}>{t.subtitle}</div>
        </header>
        <div className={styles.twoColumn}>
          <div className={styles.twoColumnLeft}>{declaredSection}</div>
          <div className={styles.twoColumnRight}>
            {silentSection}
            {fossilizedSection}
            {missingSection}
          </div>
        </div>
      </figure>
    );
  }

  // Default (v=1, v=2) — vertical stack: header → grid(declared+silent)
  // → fossilized (if any) → missing (if any).
  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <div className={styles.title}>{t.title}</div>
        <div className={styles.subtitle}>{t.subtitle}</div>
      </header>
      <div className={styles.grid}>
        {declaredSection}
        {silentSection}
      </div>
      {fossilizedSection}
      {missingSection}
    </figure>
  );
}
