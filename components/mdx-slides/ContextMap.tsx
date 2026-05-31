/**
 * TODO(ux, deferred): The visual UX of this component is parked. Known issues
 * at v0.1 to fix in one pass once the rest of the Exhibit B–H slides are
 * content-complete and the final model-viewport proportions are locked:
 *   - Shipment→Invoicing curve routes around Consignee but the "invoiceId"
 *     label apex still overlaps Consignee.
 *   - The dotted dead-boundary line has both start + end arrowheads
 *     (semantically correct for circular but visually busy).
 *   - Arrowhead sizing (2.5×2.5) still reads slightly heavy on a wide canvas.
 *   - Connection-label tones not stress-tested at higher versions (v0.5+
 *     introduces multiple overlapping tones in close space).
 * One template used nine times (slide 15 baseline + 8 exhibit closers) —
 * fix once and all nine inherit. See memory/project_contextmap-ux-deferred.
 *
 * <ContextMap version="0|1|2|3|4|5|6|7|8" />
 *
 * The recurring Model Update visual — a bounded-context map of the delivery
 * domain. Same nine entities every version (6 known contexts + 3 unknown
 * placeholders). Each version accumulates evidence from the corresponding
 * exhibit:
 *
 *   v0.0  baseline — we know nothing yet
 *   v0.1  contracts          (Exhibit A)
 *   v0.2  database           (Exhibit B)
 *   v0.3  transactions       (Exhibit C)
 *   v0.4  runtime / logs     (Exhibit D)
 *   v0.5  incidents          (Exhibit E)
 *   v0.6  data lineage       (Exhibit F)
 *   v0.7  error codes        (Exhibit G — Returns/Policy reveals)
 *   v0.8  change velocity    (Exhibit H — Carrier re-verdict)
 *
 * Design: cards = bounded contexts (DDD canon). Status colour via border.
 * Findings accumulate as chips inside cards. Connections drawn as SVG paths
 * with small arrowheads and HTML-overlay labels (so labels render at real
 * CSS pixels, not stretched by the viewBox transform).
 */
import styles from "./ContextMap.module.css";

export type ContextMapVersion = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

type Status = "unknown" | "neutral" | "amber" | "red" | "green" | "purple";

interface CardSpec {
  id: string;
  name: string;
  col: 1 | 2 | 3;
  row: 1 | 2 | 3 | 4;
  /** SVG viewBox center coordinates (0-100) */
  cx: number;
  cy: number;
}

interface Card extends CardSpec {
  status: Status;
  findings: string[];
}

interface Connection {
  from: string;
  to: string;
  style: "solid" | "dotted" | "dashed";
  thickness?: number;
  label?: string;
  tone?: Status;
  arrowEnd?: boolean;
  arrowStart?: boolean;
}

const CARDS: CardSpec[] = [
  { id: "shipment",     name: "Shipment",  col: 1, row: 1, cx: 17, cy: 12 },
  { id: "carrier",      name: "Carrier",   col: 3, row: 1, cx: 83, cy: 12 },
  { id: "consignee",    name: "Consignee", col: 1, row: 2, cx: 17, cy: 38 },
  { id: "inventory",    name: "Inventory", col: 3, row: 2, cx: 83, cy: 38 },
  { id: "invoicing",    name: "Invoicing", col: 1, row: 3, cx: 17, cy: 64 },
  { id: "tracking",     name: "Tracking",  col: 3, row: 3, cx: 83, cy: 64 },
  { id: "unknownLeft",  name: "???",       col: 1, row: 4, cx: 17, cy: 90 },
  { id: "unknownMid",   name: "???",       col: 2, row: 4, cx: 50, cy: 90 },
  { id: "unknownRight", name: "???",       col: 3, row: 4, cx: 83, cy: 90 },
];

const CAPTIONS: Record<string, string> = {
  "0": "Hypothesis v0.0 — We know nothing yet.",
  "1": "Hypothesis v0.1 — What the contracts declared. But contracts can lie. Let's check the database.",
  "2": "Hypothesis v0.2 — What the database reveals beneath.",
  "3": "Hypothesis v0.3 — What commits together. What blocks extraction.",
  "4": "Hypothesis v0.4 — What actually happens at runtime.",
  "5": "Hypothesis v0.5 — What it costs when boundaries are wrong.",
  "6": "Hypothesis v0.6 — Where data drifts and events are missing.",
  "7": "Hypothesis v0.7 — Business rules nobody documented. One new context discovered.",
  "8": "Hypothesis v0.8 — Eight lenses. One evidence-backed hypothesis.",
};

/**
 * Build the cumulative state for one card at the given version.
 * The contract: walk from v0 upward, applying each exhibit's updates.
 * Findings accumulate; status can be updated by later evidence.
 */
function buildCard(spec: CardSpec, v: number): Card {
  let status: Status = spec.id.startsWith("unknown") ? "unknown" : "neutral";
  let findings: string[] = [];
  let name = spec.name;

  // v0.7 — Returns/Policy is discovered in place of the middle unknown
  if (spec.id === "unknownMid" && v >= 7) {
    name = "Returns/Policy";
    status = "purple";
    findings.push("revealed by DEL-E011");
  }

  // v0.1 — contracts (Exhibit A)
  if (v >= 1) {
    if (spec.id === "shipment") {
      status = "amber";
      findings.push("⚠ god entity");
    }
    if (spec.id === "carrier") {
      status = "amber";
      findings.push("↔ circular");
    }
    if (spec.id === "consignee") {
      status = "amber";
      findings.push("0 events");
    }
    if (spec.id === "tracking") {
      status = "amber";
      findings.push("infra?");
    }
  }

  // v0.2 — database (Exhibit B)
  if (v >= 2) {
    if (spec.id === "inventory") {
      status = "red";
      findings.push("2 writers");
    }
    if (spec.id === "consignee") {
      findings.push("facade");
    }
  }

  // v0.3 — transactions (Exhibit C)
  if (v >= 3) {
    if (spec.id === "carrier") {
      status = "green";
      findings.push("READY ✓");
    }
    if (spec.id === "shipment") {
      findings.push("BLOCKED ✗");
    }
  }

  // v0.4 — runtime / logs (Exhibit D)
  if (v >= 4) {
    if (spec.id === "tracking") {
      findings = findings.filter((f) => f !== "infra?");
      findings.push("silent participant");
    }
  }

  // v0.5 — incidents (Exhibit E)
  if (v >= 5) {
    if (spec.id === "consignee") {
      status = "green";
      findings = findings.filter((f) => f !== "0 events" && f !== "facade");
      findings.push("clean ✓ (0 incidents)");
    }
  }

  // v0.6 — data lineage (Exhibit F): mostly connections, no card-status changes

  // v0.7 — error codes (Exhibit G): Shipment override count
  if (v >= 7) {
    if (spec.id === "shipment") {
      findings.push("⚠ 891 overrides");
    }
  }

  // v0.8 — change velocity (Exhibit H): Carrier verdict reverses
  if (v >= 8) {
    if (spec.id === "carrier") {
      status = "red";
      findings = findings.filter((f) => f !== "READY ✓");
      findings.push("NOT READY (72% co-change)");
    }
  }

  return { ...spec, name, status, findings };
}

function buildConnections(v: number): Connection[] {
  const out: Connection[] = [];

  // v0.1 — contracts: Shipment's god-entity radiation + dotted dead-boundary
  if (v >= 1) {
    out.push({ from: "shipment", to: "consignee", style: "solid",  label: "buyerId",       tone: "amber", arrowEnd: true });
    out.push({ from: "shipment", to: "inventory", style: "solid",  label: "warehouseId",   tone: "amber", arrowEnd: true });
    out.push({ from: "shipment", to: "invoicing", style: "solid",  label: "invoiceId",     tone: "amber", arrowEnd: true });
    out.push({ from: "shipment", to: "carrier",   style: "dotted", label: "dead boundary?", tone: "amber", arrowEnd: true, arrowStart: true });
  }

  // v0.2 — database: red dashed Ship↔Inv with "2 WRITERS"
  if (v >= 2) {
    out.push({ from: "shipment", to: "inventory", style: "dashed", tone: "red", thickness: 1.6, label: "2 WRITERS" });
  }

  // v0.3 — transactions: perf cost on the same coupling
  if (v >= 3) {
    out.push({ from: "shipment", to: "inventory", style: "solid", tone: "red", thickness: 1.8, label: "4,512/wk · 580ms" });
  }

  // v0.4 — runtime: sync chain in red, async path in green
  if (v >= 4) {
    out.push({ from: "inventory", to: "invoicing", style: "solid", tone: "red",   thickness: 1.4, label: "sync",       arrowEnd: true });
    out.push({ from: "shipment",  to: "carrier",   style: "solid", tone: "green", thickness: 1.2, label: "async (87s)", arrowEnd: true });
  }

  // v0.5 — incidents: thickness scaled to incident counts on the worst clusters
  if (v >= 5) {
    out.push({ from: "shipment", to: "inventory", style: "solid", tone: "red", thickness: 3.0, label: "23 incidents" });
    out.push({ from: "shipment", to: "carrier",   style: "solid", tone: "red", thickness: 2.4, label: "17 incidents" });
  }

  // v0.6 — data lineage: dotted blue address drift lines
  if (v >= 6) {
    out.push({ from: "consignee", to: "shipment", style: "dotted", tone: "amber", thickness: 0.8, label: "address" });
    out.push({ from: "consignee", to: "carrier",  style: "dotted", tone: "amber", thickness: 0.8, label: "342 mismatches" });
  }

  // v0.7 — Returns reveal: Carrier delegates DEL-E011 to the new context
  if (v >= 7) {
    out.push({ from: "carrier", to: "unknownMid", style: "solid", tone: "purple", thickness: 1.4, label: "DEL-E011", arrowEnd: true });
  }

  // v0.8 — MERGE indicator on Ship↔Carrier
  if (v >= 8) {
    out.push({ from: "shipment", to: "carrier", style: "dashed", tone: "red", thickness: 3.0, label: "MERGE (72% co-change)" });
  }

  return out;
}

/** Endpoint offset from card center so the line ends at the card edge, not the center. */
const CARD_EDGE = 9; // viewBox units

function offsetEndpoint(from: { cx: number; cy: number }, to: { cx: number; cy: number }) {
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const d = Math.hypot(dx, dy);
  if (d === 0) return { x: to.cx, y: to.cy };
  return { x: to.cx - (dx / d) * CARD_EDGE, y: to.cy - (dy / d) * CARD_EDGE };
}

/**
 * Build the SVG path for a connection.
 * - Same column with at least one card between the endpoints → bezier
 *   curve bowing into the neighbouring column so it routes around.
 * - Otherwise straight line.
 */
function buildPath(f: CardSpec, t: CardSpec): string {
  const start = offsetEndpoint(t, f);
  const end = offsetEndpoint(f, t);
  const sameCol = f.col === t.col;
  const rowGap = Math.abs(f.row - t.row);

  if (sameCol && rowGap > 1) {
    const bow = f.col === 1 ? 18 : f.col === 3 ? -18 : 0;
    const cx = (start.x + end.x) / 2 + bow;
    const cy = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
  }

  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

/**
 * Position a connection's label so it sits in clear space, not on a card.
 * Vertical lines → offset perpendicular (right of midpoint).
 * Horizontal lines → offset above midpoint.
 * Diagonals → midpoint is usually clear.
 * Curved (same-col + gap > 1) → on the curve apex (bowed out from midpoint).
 */
function buildLabelPosition(f: CardSpec, t: CardSpec) {
  const dx = t.cx - f.cx;
  const dy = t.cy - f.cy;
  const midX = (f.cx + t.cx) / 2;
  const midY = (f.cy + t.cy) / 2;
  const sameCol = f.col === t.col;
  const rowGap = Math.abs(f.row - t.row);

  // Curved (around middle card) — sit at the curve apex
  if (sameCol && rowGap > 1) {
    const bow = f.col === 1 ? 12 : f.col === 3 ? -12 : 0;
    return { x: midX + bow, y: midY };
  }

  // Mostly vertical — offset right of midpoint to clear the line
  if (Math.abs(dy) > Math.abs(dx) * 2) {
    return { x: midX + 9, y: midY };
  }
  // Mostly horizontal — offset above midpoint
  if (Math.abs(dx) > Math.abs(dy) * 2) {
    return { x: midX, y: midY - 4 };
  }
  // Diagonal — midpoint is usually fine
  return { x: midX, y: midY };
}

const TONE_FILL: Record<string, string> = {
  amber:   "var(--color-accent, #C9A96E)",
  red:     "#B26464",
  green:   "#6E9B6E",
  purple:  "#8C78A5",
  neutral: "var(--color-text-muted, #999)",
};

const toneClass = (s: Status) =>
  ({
    unknown: styles.statusUnknown,
    neutral: styles.statusNeutral,
    amber: styles.statusAmber,
    red: styles.statusRed,
    green: styles.statusGreen,
    purple: styles.statusPurple,
  }[s]);

const dashArray = (s: "solid" | "dotted" | "dashed") => {
  if (s === "dotted") return "1 1.6";
  if (s === "dashed") return "3 2";
  return undefined;
};

function parseVersion(raw: string | number): number {
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 8) return 8;
  return n;
}

interface ContextMapProps {
  version: ContextMapVersion | number | string;
}

export function ContextMap({ version }: ContextMapProps) {
  const v = parseVersion(version);
  const cards = CARDS.map((spec) => buildCard(spec, v));
  const connections = buildConnections(v);
  const caption = CAPTIONS[String(v)] || CAPTIONS["0"];

  return (
    <figure className={styles.figure} aria-label={`Domain context map — ${caption}`}>
      <div className={styles.canvas}>
        <svg
          className={styles.svgOverlay}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {(["amber", "red", "green", "purple", "neutral"] as const).map((tone) => (
              <marker
                key={tone}
                id={`ctxmap-arrow-${tone}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="2.5"
                markerHeight="2.5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={TONE_FILL[tone]} />
              </marker>
            ))}
          </defs>
          {connections.map((conn, i) => {
            const f = cards.find((c) => c.id === conn.from);
            const t = cards.find((c) => c.id === conn.to);
            if (!f || !t) return null;
            const tone = conn.tone ?? "amber";
            return (
              <path
                key={i}
                d={buildPath(f, t)}
                fill="none"
                stroke={TONE_FILL[tone]}
                strokeWidth={conn.thickness ?? 1.2}
                strokeDasharray={dashArray(conn.style)}
                markerEnd={conn.arrowEnd ? `url(#ctxmap-arrow-${tone})` : undefined}
                markerStart={conn.arrowStart ? `url(#ctxmap-arrow-${tone})` : undefined}
              />
            );
          })}
        </svg>

        <div className={styles.labelOverlay} aria-hidden="true">
          {connections
            .filter((c) => c.label)
            .map((conn, i) => {
              const f = cards.find((c) => c.id === conn.from);
              const t = cards.find((c) => c.id === conn.to);
              if (!f || !t) return null;
              const pos = buildLabelPosition(f, t);
              const tone = conn.tone ?? "amber";
              return (
                <div
                  key={i}
                  className={`${styles.lineLabel} ${toneClass(tone)}`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  {conn.label}
                </div>
              );
            })}
        </div>

        <div className={styles.grid}>
          {cards.map((card) => {
            const isUnknown = card.status === "unknown";
            return (
              <div
                key={card.id}
                className={`${styles.card} ${toneClass(card.status)} ${
                  isUnknown ? styles.cardUnknown : ""
                }`}
                style={{ gridColumn: card.col, gridRow: card.row }}
              >
                <div className={styles.cardName}>{card.name}</div>
                {card.findings.map((f) => (
                  <div key={f} className={styles.cardFinding}>
                    {f}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  );
}
