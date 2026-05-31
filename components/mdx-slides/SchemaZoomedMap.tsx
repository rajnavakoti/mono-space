/**
 * <SchemaZoomedMap />
 *
 * Option C redesign of the recurring Model Update visual. Each context
 * renders as a mini code window showing its key schema (3-4 lines). The
 * model IS the schemas, and the audience sees the actual evidence inside
 * each context. Reuses the OpenAPI/CodeBlock aesthetic from earlier slides.
 *
 * v0.1 hardcoded for evaluation.
 */
import styles from "./SchemaZoomedMap.module.css";

interface ContextSchema {
  id: string;
  title: string;
  /** Schema lines shown in the body */
  lines: string[];
  /** A short note rendered below the schema body */
  note?: string;
  /** Status — affects border accent */
  status: "neutral" | "amber" | "unknown";
  col: 1 | 2 | 3;
  row: 1 | 2 | 3 | 4;
  cx: number;
  cy: number;
}

interface Connection {
  from: string;
  to: string;
  label: string;
  style: "solid" | "dotted";
}

const BASE_SCHEMAS: ContextSchema[] = [
  {
    id: "shipment",
    title: "shipment",
    lines: ["Order:", "  orderId", "  status", "  lines"],
    status: "neutral",
    col: 1, row: 1, cx: 17, cy: 14,
  },
  {
    id: "carrier",
    title: "carrier",
    lines: ["Shipment:", "  shipmentId", "  orderId", "  trackingNumber"],
    status: "neutral",
    col: 3, row: 1, cx: 83, cy: 14,
  },
  {
    id: "consignee",
    title: "consignee",
    lines: ["Customer:", "  customerId", "  name", "  email"],
    status: "neutral",
    col: 1, row: 2, cx: 17, cy: 38,
  },
  {
    id: "inventory",
    title: "inventory",
    lines: ["Reservation:", "  reservationId", "  orderId", "  warehouseId"],
    status: "neutral",
    col: 3, row: 2, cx: 83, cy: 38,
  },
  {
    id: "invoicing",
    title: "invoicing",
    lines: ["Invoice:", "  invoiceId", "  orderId", "  amount"],
    status: "neutral",
    col: 1, row: 3, cx: 17, cy: 62,
  },
  {
    id: "tracking",
    title: "tracking",
    lines: ["Notification:", "  notificationId", "  userId"],
    status: "neutral",
    col: 3, row: 3, cx: 83, cy: 62,
  },
  { id: "unknownLeft",  title: "?", lines: ["???"], status: "unknown", col: 1, row: 4, cx: 17, cy: 88 },
  { id: "unknownMid",   title: "?", lines: ["???"], status: "unknown", col: 2, row: 4, cx: 50, cy: 88 },
  { id: "unknownRight", title: "?", lines: ["???"], status: "unknown", col: 3, row: 4, cx: 83, cy: 88 },
];

const V1_ANNOTATIONS: Record<string, { status: "amber"; note: string; extraLines?: string[] }> = {
  shipment:  { status: "amber", note: "⚠ god entity",      extraLines: ["  buyerId  # from Consignee", "  carrierId # from Carrier"] },
  carrier:   { status: "amber", note: "↔ circular w/ Shipment" },
  consignee: { status: "amber", note: "0 events" },
  tracking:  { status: "amber", note: "infra?" },
};

const V1_CONNECTIONS: Connection[] = [
  { from: "shipment", to: "consignee", label: "id",       style: "solid"  },
  { from: "shipment", to: "inventory", label: "id",       style: "solid"  },
  { from: "shipment", to: "invoicing", label: "id",       style: "solid"  },
  { from: "shipment", to: "carrier",   label: "circular", style: "dotted" },
];

const CAPTIONS: Record<string, string> = {
  "0": "Hypothesis v0.0 — We know nothing yet.",
  "1": "Hypothesis v0.1 — What the contracts declared. But contracts can lie. Let's check the database.",
};

interface Props {
  version: "0" | "1" | number | string;
}

export function SchemaZoomedMap({ version }: Props) {
  const v = String(version);
  const schemas = BASE_SCHEMAS.map((s) => {
    const ann = v === "1" ? V1_ANNOTATIONS[s.id] : undefined;
    if (!ann) return s;
    return {
      ...s,
      status: ann.status,
      note: ann.note,
      lines: ann.extraLines ? [...s.lines, ...ann.extraLines] : s.lines,
    };
  });
  const connections = v === "1" ? V1_CONNECTIONS : [];
  const caption = CAPTIONS[v] || CAPTIONS["0"];

  return (
    <figure className={styles.figure}>
      <div className={styles.canvas}>
        <svg className={styles.svgOverlay} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="szm-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {connections.map((conn, i) => {
            const f = schemas.find((s) => s.id === conn.from);
            const t = schemas.find((s) => s.id === conn.to);
            if (!f || !t) return null;
            const dash = conn.style === "dotted" ? "1 1.5" : undefined;
            return (
              <line
                key={i}
                x1={f.cx}
                y1={f.cy}
                x2={t.cx}
                y2={t.cy}
                className={styles.line}
                strokeWidth={1.3}
                strokeDasharray={dash}
                markerEnd="url(#szm-arrow)"
              />
            );
          })}
        </svg>

        <div className={styles.grid}>
          {schemas.map((s) => (
            <div
              key={s.id}
              className={`${styles.codeWindow} ${styles[`status${s.status[0].toUpperCase()}${s.status.slice(1)}`]}`}
              style={{ gridColumn: s.col, gridRow: s.row }}
            >
              <div className={styles.titleBar}>
                <span className={styles.dots}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                </span>
                <span className={styles.title}>{s.title}</span>
              </div>
              <pre className={styles.code}>{s.lines.join("\n")}</pre>
              {s.note && <div className={styles.note}>{s.note}</div>}
            </div>
          ))}
        </div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
