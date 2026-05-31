/**
 * <BoundedContextCards />
 *
 * Option A redesign of the recurring Model Update visual. Each bounded
 * context renders as a labelled rectangular card (heavy border + monospace,
 * a la a DDD bounded-context canvas) with the findings shown as chips
 * inside the card. Status colour via the border. Connections drawn as
 * arrows in an SVG overlay.
 *
 * v0.1 hardcoded for evaluation. If chosen, extends to v0.0-v0.8.
 */
import styles from "./BoundedContextCards.module.css";

type Status = "unknown" | "neutral" | "amber" | "red" | "green" | "purple";

interface CardSpec {
  id: string;
  name: string;
  status: Status;
  findings: string[];
  col: 1 | 2 | 3;
  row: 1 | 2 | 3 | 4;
  /** SVG viewBox center coords (used for line endpoints) */
  cx: number;
  cy: number;
  isUnknown?: boolean;
}

interface Connection {
  from: string;
  to: string;
  style: "solid" | "dotted" | "dashed";
  label?: string;
}

const BASE_CARDS: CardSpec[] = [
  { id: "shipment",     name: "Shipment",  status: "neutral", findings: [], col: 1, row: 1, cx: 17, cy: 12 },
  { id: "carrier",      name: "Carrier",   status: "neutral", findings: [], col: 3, row: 1, cx: 83, cy: 12 },
  { id: "consignee",    name: "Consignee", status: "neutral", findings: [], col: 1, row: 2, cx: 17, cy: 38 },
  { id: "inventory",    name: "Inventory", status: "neutral", findings: [], col: 3, row: 2, cx: 83, cy: 38 },
  { id: "invoicing",    name: "Invoicing", status: "neutral", findings: [], col: 1, row: 3, cx: 17, cy: 64 },
  { id: "tracking",     name: "Tracking",  status: "neutral", findings: [], col: 3, row: 3, cx: 83, cy: 64 },
  { id: "unknownLeft",  name: "???",       status: "unknown", findings: [], col: 1, row: 4, cx: 17, cy: 90, isUnknown: true },
  { id: "unknownMid",   name: "???",       status: "unknown", findings: [], col: 2, row: 4, cx: 50, cy: 90, isUnknown: true },
  { id: "unknownRight", name: "???",       status: "unknown", findings: [], col: 3, row: 4, cx: 83, cy: 90, isUnknown: true },
];

const V1_FINDINGS: Record<string, { status: Status; findings: string[] }> = {
  shipment:  { status: "amber", findings: ["⚠ god entity"] },
  carrier:   { status: "amber", findings: ["↔ circular"] },
  consignee: { status: "amber", findings: ["0 events"] },
  tracking:  { status: "amber", findings: ["infra?"] },
};

const V1_CONNECTIONS: Connection[] = [
  { from: "shipment", to: "consignee", style: "solid",  label: "buyerId" },
  { from: "shipment", to: "inventory", style: "solid",  label: "warehouseId" },
  { from: "shipment", to: "invoicing", style: "solid",  label: "invoiceId" },
  { from: "shipment", to: "carrier",   style: "dotted", label: "dead boundary?" },
];

const CAPTIONS: Record<string, string> = {
  "0": "Hypothesis v0.0 — We know nothing yet.",
  "1": "Hypothesis v0.1 — What the contracts declared. But contracts can lie. Let's check the database.",
};

const STATUS_CLASS: Record<Status, string> = {
  unknown: "statusUnknown",
  neutral: "statusNeutral",
  amber:   "statusAmber",
  red:     "statusRed",
  green:   "statusGreen",
  purple:  "statusPurple",
};

interface Props {
  version: "0" | "1" | number | string;
}

export function BoundedContextCards({ version }: Props) {
  const v = String(version);
  const cards = BASE_CARDS.map((c) => {
    const v1 = v === "1" ? V1_FINDINGS[c.id] : undefined;
    return v1 ? { ...c, status: v1.status, findings: v1.findings } : c;
  });
  const connections = v === "1" ? V1_CONNECTIONS : [];
  const caption = CAPTIONS[v] || CAPTIONS["0"];

  return (
    <figure className={styles.figure}>
      <div className={styles.canvas}>
        <svg className={styles.svgOverlay} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="bcc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {connections.map((conn, i) => {
            const f = cards.find((c) => c.id === conn.from);
            const t = cards.find((c) => c.id === conn.to);
            if (!f || !t) return null;
            const dash = conn.style === "dotted" ? "1 1.5" : conn.style === "dashed" ? "3 2" : undefined;
            return (
              <line
                key={i}
                x1={f.cx}
                y1={f.cy}
                x2={t.cx}
                y2={t.cy}
                className={styles.line}
                strokeWidth={1.4}
                strokeDasharray={dash}
                markerEnd="url(#bcc-arrow)"
              />
            );
          })}
        </svg>

        {/* Connection labels as positioned HTML so they render at real CSS px */}
        <div className={styles.labelOverlay} aria-hidden="true">
          {connections.filter((c) => c.label).map((conn, i) => {
            const f = cards.find((c) => c.id === conn.from);
            const t = cards.find((c) => c.id === conn.to);
            if (!f || !t) return null;
            const midX = (f.cx + t.cx) / 2;
            const midY = (f.cy + t.cy) / 2;
            return (
              <div
                key={i}
                className={styles.lineLabel}
                style={{ left: `${midX}%`, top: `${midY}%` }}
              >
                {conn.label}
              </div>
            );
          })}
        </div>

        <div className={styles.grid}>
          {cards.map((card) => (
            <div
              key={card.id}
              className={`${styles.card} ${styles[STATUS_CLASS[card.status]]} ${card.isUnknown ? styles.cardUnknown : ""}`}
              style={{ gridColumn: card.col, gridRow: card.row }}
            >
              <div className={styles.cardName}>{card.name}</div>
              {card.findings.map((f) => (
                <div key={f} className={styles.cardFinding}>{f}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
