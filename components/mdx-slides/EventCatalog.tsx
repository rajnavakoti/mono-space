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

interface CatalogData {
  declared: DeclaredDomain[];
  silent: string[];
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
  // For now: v0.1 data is the only catalog shipped. v0.2 / v0.3 data
  // (fossilised + missing events) is added when Exhibits C and D land.
  const data = EXHIBIT_A_DEFAULTS;
  const declaredCount = data.declared.reduce(
    (n, d) => n + d.events.length,
    0,
  );

  return (
    <figure className={styles.figure}>
      <header className={styles.header}>
        <div className={styles.title}>{t.title}</div>
        <div className={styles.subtitle}>{t.subtitle}</div>
      </header>

      <div className={styles.grid}>
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
      </div>

      <p className={styles.punchline}>
        <strong>{declaredCount} declared.</strong>{" "}
        {data.silent.length} services publish nothing.
      </p>
    </figure>
  );
}
