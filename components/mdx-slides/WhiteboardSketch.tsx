/**
 * <WhiteboardSketch />
 *
 * Option B redesign of the recurring Model Update visual. Same six known
 * contexts + three ??? placeholders, but rendered as a working whiteboard
 * mid-investigation: lightly off-axis boxes, amber sticky-note annotations
 * attached to elements with leader lines, slightly hand-drawn feel.
 *
 * v0.1 hardcoded for evaluation.
 */
import styles from "./WhiteboardSketch.module.css";

interface BoxSpec {
  id: string;
  name: string;
  col: 1 | 2 | 3;
  row: 1 | 2 | 3 | 4;
  rotate: number;
  isUnknown?: boolean;
  cx: number;
  cy: number;
}

interface StickyNote {
  text: string;
  targetId: string;
  offsetX: number; // viewBox %; relative to target
  offsetY: number;
}

interface Connection {
  from: string;
  to: string;
  style: "solid" | "dotted";
}

const BASE_BOXES: BoxSpec[] = [
  { id: "shipment",     name: "Shipment",  col: 1, row: 1, rotate: -1.2, cx: 17, cy: 13 },
  { id: "carrier",      name: "Carrier",   col: 3, row: 1, rotate:  0.8, cx: 83, cy: 13 },
  { id: "consignee",    name: "Consignee", col: 1, row: 2, rotate:  0.6, cx: 17, cy: 38 },
  { id: "inventory",    name: "Inventory", col: 3, row: 2, rotate: -0.7, cx: 83, cy: 38 },
  { id: "invoicing",    name: "Invoicing", col: 1, row: 3, rotate: -0.4, cx: 17, cy: 63 },
  { id: "tracking",     name: "Tracking",  col: 3, row: 3, rotate:  1.0, cx: 83, cy: 63 },
  { id: "unknownLeft",  name: "?",         col: 1, row: 4, rotate: -2.0, cx: 17, cy: 89, isUnknown: true },
  { id: "unknownMid",   name: "?",         col: 2, row: 4, rotate:  1.5, cx: 50, cy: 89, isUnknown: true },
  { id: "unknownRight", name: "?",         col: 3, row: 4, rotate: -1.0, cx: 83, cy: 89, isUnknown: true },
];

const V1_STICKIES: StickyNote[] = [
  { text: "⚠ god entity",      targetId: "shipment",  offsetX: 14, offsetY: -2 },
  { text: "↔ circular",         targetId: "carrier",   offsetX: -16, offsetY: -2 },
  { text: "0 events",           targetId: "consignee", offsetX: 14, offsetY:  3 },
  { text: "infra?",             targetId: "tracking",  offsetX: -10, offsetY:  6 },
];

const V1_CONNECTIONS: Connection[] = [
  { from: "shipment", to: "consignee", style: "solid"  },
  { from: "shipment", to: "inventory", style: "solid"  },
  { from: "shipment", to: "invoicing", style: "solid"  },
  { from: "shipment", to: "carrier",   style: "dotted" },
];

const CAPTIONS: Record<string, string> = {
  "0": "Hypothesis v0.0 — We know nothing yet.",
  "1": "Hypothesis v0.1 — What the contracts declared. But contracts can lie. Let's check the database.",
};

interface Props {
  version: "0" | "1" | number | string;
}

export function WhiteboardSketch({ version }: Props) {
  const v = String(version);
  const stickies = v === "1" ? V1_STICKIES : [];
  const connections = v === "1" ? V1_CONNECTIONS : [];
  const caption = CAPTIONS[v] || CAPTIONS["0"];

  return (
    <figure className={styles.figure}>
      <div className={styles.canvas}>
        <svg className={styles.svgOverlay} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="ws-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {connections.map((conn, i) => {
            const f = BASE_BOXES.find((b) => b.id === conn.from);
            const t = BASE_BOXES.find((b) => b.id === conn.to);
            if (!f || !t) return null;
            const dash = conn.style === "dotted" ? "1 1.4" : undefined;
            // Slight curve via cubic bezier control offset
            const cx1 = (f.cx + t.cx) / 2 + 3;
            const cy1 = (f.cy + t.cy) / 2 - 2;
            return (
              <path
                key={i}
                d={`M ${f.cx} ${f.cy} Q ${cx1} ${cy1} ${t.cx} ${t.cy}`}
                className={styles.line}
                strokeWidth={1.4}
                strokeDasharray={dash}
                markerEnd="url(#ws-arrow)"
              />
            );
          })}
        </svg>

        <div className={styles.grid}>
          {BASE_BOXES.map((box) => (
            <div
              key={box.id}
              className={`${styles.box} ${box.isUnknown ? styles.boxUnknown : ""}`}
              style={{
                gridColumn: box.col,
                gridRow: box.row,
                transform: `rotate(${box.rotate}deg)`,
              }}
            >
              <span className={styles.boxLabel}>{box.name}</span>
            </div>
          ))}
        </div>

        {/* Sticky-note annotations overlaying the canvas */}
        <div className={styles.stickyOverlay} aria-hidden="true">
          {stickies.map((s, i) => {
            const target = BASE_BOXES.find((b) => b.id === s.targetId);
            if (!target) return null;
            return (
              <div
                key={i}
                className={styles.sticky}
                style={{
                  left: `${target.cx + s.offsetX}%`,
                  top: `${target.cy + s.offsetY}%`,
                  transform: `translate(-50%, -50%) rotate(${(i % 2 === 0 ? -2 : 2)}deg)`,
                }}
              >
                {s.text}
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
