/**
 * <ContextMap version={0..8} />
 *
 * Reusable evidence-backed model component for the DDD Europe deck.
 * Spec: ddd-archaeology/docs/exhibit-slides-spec.md
 *
 * Design choices (per documented preferences):
 *   - CSS Grid for circle positioning (HTML divs)
 *   - Inline SVG overlay only for connection lines/arrows
 *   - All colour via CSS custom properties (theme-aware, dark + light)
 *   - Cumulative state model: each version adds to the previous
 *
 * v0 and v1 are tuned visually for the first exhibit migration.
 * v2-v8 wire up the cumulative additions per spec but their visual
 * polish will land alongside the respective exhibit migrations.
 */
import styles from "./ContextMap.module.css";

export type ContextMapVersion = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type CircleId =
  | "shipment"
  | "carrier"
  | "consignee"
  | "inventory"
  | "invoicing"
  | "tracking"
  | "unknownLeft"
  | "unknownMid"
  | "unknownRight";

type Tone = "gray" | "amber" | "red" | "green" | "purple";

type LineStyle = "solid" | "dashed" | "dotted";

interface CircleSpec {
  id: CircleId;
  defaultLabel: string;
  /** CSS Grid column (1-3) */
  col: 1 | 2 | 3;
  /** CSS Grid row (1-4) */
  row: 1 | 2 | 3 | 4;
  /** SVG viewBox center coordinates (viewBox is 0-100 wide, 0-100 tall) */
  cx: number;
  cy: number;
}

const VIEWBOX_SIZE = 100;
const CIRCLE_RADIUS_VB = 10; // in viewBox units; used to offset line endpoints

const CIRCLES: CircleSpec[] = [
  { id: "shipment",     defaultLabel: "Shipment",  col: 1, row: 1, cx: 17, cy: 14 },
  { id: "carrier",      defaultLabel: "Carrier",   col: 3, row: 1, cx: 83, cy: 14 },
  { id: "consignee",    defaultLabel: "Consignee", col: 1, row: 2, cx: 17, cy: 40 },
  { id: "inventory",    defaultLabel: "Inventory", col: 3, row: 2, cx: 83, cy: 40 },
  { id: "invoicing",    defaultLabel: "Invoicing", col: 1, row: 3, cx: 17, cy: 65 },
  { id: "tracking",     defaultLabel: "Tracking",  col: 3, row: 3, cx: 83, cy: 65 },
  { id: "unknownLeft",  defaultLabel: "???",       col: 1, row: 4, cx: 17, cy: 90 },
  { id: "unknownMid",   defaultLabel: "???",       col: 2, row: 4, cx: 50, cy: 90 },
  { id: "unknownRight", defaultLabel: "???",       col: 3, row: 4, cx: 83, cy: 90 },
];

const CIRCLE_BY_ID: Record<CircleId, CircleSpec> = CIRCLES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CircleId, CircleSpec>,
);

const CAPTIONS: Record<ContextMapVersion, string> = {
  0: "Hypothesis v0.0 — We know nothing yet.",
  1: "Hypothesis v0.1 — What the contracts declared.",
  2: "Hypothesis v0.2 — What the database reveals beneath.",
  3: "Hypothesis v0.3 — What commits together. What blocks extraction.",
  4: "Hypothesis v0.4 — What actually happens at runtime.",
  5: "Hypothesis v0.5 — What it costs when boundaries are wrong.",
  6: "Hypothesis v0.6 — Where data drifts and events are missing.",
  7: "Hypothesis v0.7 — Business rules nobody documented. One new context discovered.",
  8: "Hypothesis v0.8 — Eight lenses. One evidence-backed hypothesis.",
};

/** Label shown inside each circle. Special-cased for unknownMid → Returns/Policy at v7+. */
function circleLabel(id: CircleId, version: ContextMapVersion): string {
  if (id === "unknownMid" && version >= 7) return "Returns/Policy";
  return CIRCLE_BY_ID[id].defaultLabel;
}

/** Tone (colour state) for a circle at a given version. Last applicable rule wins. */
function circleTone(id: CircleId, version: ContextMapVersion): Tone {
  // Cumulative rules: latest match takes effect.
  if (id === "shipment") {
    if (version >= 1) return "amber";
    return "gray";
  }
  if (id === "carrier") {
    if (version >= 8) return "red";       // v0.8: NOT READY after H override
    if (version >= 3) return "green";     // v0.3: READY from clean txns
    return "gray";
  }
  if (id === "consignee") {
    if (version >= 5) return "green";     // v0.5: confirmed clean (0 incidents)
    return "gray";
  }
  if (id === "inventory") {
    if (version >= 2) return "red";       // v0.2: 2 writers, boundary violation
    return "gray";
  }
  if (id === "unknownMid" && version >= 7) return "purple"; // Returns/Policy reveal
  return "gray";
}

/** Small text labels rendered next to each circle (e.g. ⚠ GOD, 0 events). */
function circleSublabels(id: CircleId, version: ContextMapVersion): string[] {
  const out: string[] = [];
  if (id === "shipment") {
    if (version >= 1) out.push("⚠ GOD");
    if (version >= 3) out.push("BLOCKED ✗");
    if (version >= 7) out.push("⚠ 891 overrides");
  }
  if (id === "consignee") {
    if (version >= 1) out.push("0 events");
    if (version >= 2) out.push("facade");        // v2: facade reveal
    if (version >= 3) out.push("READY ✓");
  }
  if (id === "carrier") {
    if (version >= 3 && version < 8) out.push("READY ✓");
    if (version >= 8) out.push("NOT READY (72% co-change)");
  }
  if (id === "tracking" && version >= 4) {
    out.push("silent participant");
  }
  if (id === "inventory" && version >= 2) {
    out.push("2 WRITERS");
  }
  return out;
}

interface LineSpec {
  from: CircleId;
  to: CircleId;
  style: LineStyle;
  tone: Tone;
  thickness: number;
  label?: string;
  /** Draw arrowhead at `to` endpoint */
  arrowEnd?: boolean;
  /** Draw arrowhead at `from` endpoint (for bidirectional dead-boundary) */
  arrowStart?: boolean;
}

/** Connection lines visible at a given version (cumulative across versions). */
function lines(version: ContextMapVersion): LineSpec[] {
  const out: LineSpec[] = [];

  // v0.1: Shipment's coupling arrows (god entity) + Shipment↔Carrier dotted dead-boundary
  if (version >= 1) {
    out.push({ from: "shipment", to: "consignee", style: "solid", tone: "amber", thickness: 1.2, label: "buyerId",     arrowEnd: true });
    out.push({ from: "shipment", to: "inventory", style: "solid", tone: "amber", thickness: 1.2, label: "warehouseId", arrowEnd: true });
    out.push({ from: "shipment", to: "invoicing", style: "solid", tone: "amber", thickness: 1.2, label: "invoiceId",   arrowEnd: true });
    out.push({ from: "shipment", to: "carrier",   style: "dotted", tone: "amber", thickness: 1.4, label: "dead boundary?", arrowEnd: true, arrowStart: true });
  }

  // v0.2: red dashed DB-coupling on Shipment↔Inventory (2 writers)
  if (version >= 2) {
    out.push({ from: "shipment", to: "inventory", style: "dashed", tone: "red", thickness: 2, label: "2 WRITERS" });
  }

  // v0.3: solid Shipment↔Carrier (after clean txn data) + perf label on Shipment↔Inventory
  if (version >= 3) {
    out.push({ from: "shipment", to: "inventory", style: "solid", tone: "red", thickness: 2.2, label: "4,512/wk · 580ms" });
  }

  // v0.4: runtime flow — sync chain red, async green
  if (version >= 4) {
    out.push({ from: "inventory", to: "invoicing", style: "solid", tone: "red",   thickness: 2,   label: "sync",  arrowEnd: true });
    out.push({ from: "shipment",  to: "carrier",   style: "solid", tone: "green", thickness: 1.5, label: "async (87s)", arrowEnd: true });
  }

  // v0.5: line thickness scales to incident counts on the worst clusters
  if (version >= 5) {
    out.push({ from: "shipment", to: "inventory", style: "solid", tone: "red", thickness: 3.5, label: "23 incidents" });
    out.push({ from: "shipment", to: "carrier",   style: "solid", tone: "red", thickness: 3,   label: "17 incidents" });
  }

  // v0.6: data flow dotted blue lines + 342 mismatches label
  if (version >= 6) {
    out.push({ from: "consignee", to: "shipment",  style: "dotted", tone: "amber", thickness: 1, label: "address" });
    out.push({ from: "consignee", to: "carrier",   style: "dotted", tone: "amber", thickness: 1, label: "342 mismatches" });
    out.push({ from: "consignee", to: "invoicing", style: "dotted", tone: "amber", thickness: 1 });
  }

  // v0.7: Returns/Policy reveal — Carrier delegates the DEL-E011 rule
  if (version >= 7) {
    out.push({ from: "carrier", to: "unknownMid", style: "solid", tone: "purple", thickness: 1.5, label: "DEL-E011", arrowEnd: true });
  }

  // v0.8: Shipment + Carrier merge indicator
  if (version >= 8) {
    out.push({ from: "shipment", to: "carrier", style: "dashed", tone: "red", thickness: 4, label: "MERGE (72% co-change)" });
  }

  return out;
}

/** Geometric endpoint of a line, offset from the circle edge so it doesn't cross into the circle. */
function endpoint(from: CircleSpec, to: CircleSpec): { x: number; y: number } {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return { x: to.cx, y: to.cy };
  const ux = dx / dist;
  const uy = dy / dist;
  return { x: to.cx - ux * CIRCLE_RADIUS_VB, y: to.cy - uy * CIRCLE_RADIUS_VB };
}

function toneClass(tone: Tone): string {
  return {
    gray: styles.toneGray,
    amber: styles.toneAmber,
    red: styles.toneRed,
    green: styles.toneGreen,
    purple: styles.tonePurple,
  }[tone];
}

function strokeDash(style: LineStyle): string | undefined {
  if (style === "dashed") return "3 2";
  if (style === "dotted") return "1 1.5";
  return undefined;
}

interface ContextMapProps {
  version: ContextMapVersion;
}

export function ContextMap({ version }: ContextMapProps) {
  const allLines = lines(version);

  return (
    <figure className={styles.contextMap} aria-label={`Domain context map — ${CAPTIONS[version]}`}>
      <div className={styles.canvas}>
        {/* SVG overlay: connection lines */}
        <svg
          className={styles.svgOverlay}
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {(["gray", "amber", "red", "green", "purple"] as Tone[]).map((tone) => (
              <marker
                key={tone}
                id={`arrow-${tone}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="4"
                markerHeight="4"
                orient="auto"
                className={toneClass(tone)}
              >
                <path d="M 0 0 L 10 5 L 0 10 z" />
              </marker>
            ))}
          </defs>
          {allLines.map((ln, i) => {
            const fromC = CIRCLE_BY_ID[ln.from];
            const toC = CIRCLE_BY_ID[ln.to];
            const start = endpoint(toC, fromC);
            const end = endpoint(fromC, toC);
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            return (
              <g key={i} className={`${styles.line} ${toneClass(ln.tone)}`}>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  strokeWidth={ln.thickness}
                  strokeDasharray={strokeDash(ln.style)}
                  markerEnd={ln.arrowEnd ? `url(#arrow-${ln.tone})` : undefined}
                  markerStart={ln.arrowStart ? `url(#arrow-${ln.tone})` : undefined}
                />
                {ln.label && (
                  <text
                    x={midX}
                    y={midY - 1.2}
                    textAnchor="middle"
                    className={styles.lineLabel}
                  >
                    {ln.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* HTML grid: circles */}
        <div className={styles.grid}>
          {CIRCLES.map((c) => {
            const tone = circleTone(c.id, version);
            const label = circleLabel(c.id, version);
            const sublabels = circleSublabels(c.id, version);
            return (
              <div
                key={c.id}
                className={`${styles.circle} ${toneClass(tone)}`}
                style={{ gridColumn: c.col, gridRow: c.row }}
                data-circle={c.id}
              >
                <span className={styles.circleName}>{label}</span>
                {sublabels.map((s) => (
                  <span key={s} className={styles.sublabel}>{s}</span>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <figcaption className={styles.caption}>{CAPTIONS[version]}</figcaption>
    </figure>
  );
}
