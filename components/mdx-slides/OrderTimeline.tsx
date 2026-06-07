/**
 * <OrderTimeline
 *    events="09:14:02::Shipment::Order CREATED::sync|…"
 *    gapAfter="3"
 *    gapLabel="87 second gap"
 * />
 *
 * Vertical timeline visual for the Exhibit D "Trace one entity"
 * slide. Each event is a row: timestamp on the left, a service-coloured
 * block in the middle, the event description on the right.
 *
 * `gapAfter` is the 1-based index of the event AFTER which a visible
 * gap renders (e.g. the 87-second async break between Invoicing and
 * Carrier).
 *
 * Event format: `timestamp::service::description::phase`. `phase` is
 * an optional tone — "sync" tints the row left edge red; "async" tints
 * it green; anything else stays neutral.
 */
import styles from "./OrderTimeline.module.css";

interface OrderTimelineProps {
  /**
   * Pipe-separated events. Each event is
   *   `timestamp::service::description[::phase]`
   */
  events: string;
  /**
   * 1-based index of the event after which a visual gap renders.
   * Combine with `gapLabel` (e.g. "87 second gap") for the break.
   */
  gapAfter?: string | number;
  /** Label shown inside the gap (e.g. "87 second gap"). */
  gapLabel?: string;
  /** Optional one-line caption rendered below the timeline. */
  caption?: string;
}

interface Event {
  timestamp: string;
  service: string;
  description: string;
  phase: "sync" | "async" | "neutral";
}

function parseEvent(raw: string): Event {
  const parts = raw.split("::").map((s) => s.trim());
  const phase =
    parts[3] === "sync"
      ? "sync"
      : parts[3] === "async"
        ? "async"
        : "neutral";
  return {
    timestamp: parts[0] ?? "",
    service: parts[1] ?? "",
    description: parts[2] ?? "",
    phase,
  };
}

const SERVICE_CLASS: Record<string, string> = {
  Shipment: "serviceShipment",
  Inventory: "serviceInventory",
  Invoicing: "serviceInvoicing",
  Tracking: "serviceTracking",
  Carrier: "serviceCarrier",
  Consignee: "serviceConsignee",
};

const PHASE_CLASS: Record<Event["phase"], string> = {
  sync: "rowSync",
  async: "rowAsync",
  neutral: "rowNeutral",
};

export function OrderTimeline({
  events,
  gapAfter,
  gapLabel,
  caption,
}: OrderTimelineProps) {
  const eventList = events.split("|").map(parseEvent);
  const gapIdx =
    gapAfter !== undefined ? Number.parseInt(String(gapAfter), 10) : -1;

  return (
    <figure className={styles.figure}>
      <div className={styles.timeline}>
        {eventList.map((e, i) => {
          const serviceClass =
            SERVICE_CLASS[e.service] ?? styles.serviceDefault;
          const phaseClass = PHASE_CLASS[e.phase];
          return (
            <div key={i}>
              <div className={`${styles.row} ${styles[phaseClass]}`}>
                <span className={styles.timestamp}>{e.timestamp}</span>
                <span
                  className={`${styles.serviceTag} ${styles[serviceClass]}`}
                >
                  {e.service}
                </span>
                <span className={styles.description}>{e.description}</span>
              </div>
              {i + 1 === gapIdx && (
                <div className={styles.gap}>
                  <span className={styles.gapLine} />
                  <span className={styles.gapLabel}>
                    {gapLabel ?? "gap"}
                  </span>
                  <span className={styles.gapLine} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {caption && <div className={styles.caption}>{caption}</div>}
    </figure>
  );
}
