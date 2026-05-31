/**
 * <BoundedContextMap version="0|1|2|3|4|5|6|7|8" />
 *
 * The recurring Model Update visual for the DDD Europe talk. Bounded
 * contexts rendered as overlapping organic regions (not the rectangular
 * grid the earlier ContextMap used). Overlap = coupling. Each version
 * shows the cumulative evidence collected up to that exhibit.
 *
 * The audience watches the canvas redrawn nine times across the talk:
 *
 *   v0.0  empty baseline — six small gray ovals, no relationships
 *   v0.1  Shipment GROWS into an irregular blob (god entity). Other
 *         contexts colour up. Shipment-Carrier overlap appears (dead
 *         boundary).
 *   v0.2  Inventory turns red and starts overlapping Shipment (2 writers).
 *         Consignee gets a leaky tendril (facade).
 *   v0.3  Carrier turns green (READY). Shipment gains BLOCKED.
 *   v0.4  A red sync-chain ribbon highlights Shipment→Inventory→Invoicing.
 *         A dotted green async line connects toward Carrier (87s gap).
 *         Tracking re-labelled "silent participant".
 *   v0.5  Overlap regions intensify in proportion to incident counts.
 *         Consignee turns green (zero incidents).
 *   v0.6  Three dotted address-flow tendrils fan out from Consignee.
 *         "342 mismatches" sits between Shipment-Carrier.
 *   v0.7  Returns/Policy MATERIALISES in previously empty space (purple).
 *         Carrier delegates DEL-E011 to it.
 *   v0.8  Shipment and Carrier FUSE into one merged blob ("SHIPMENT
 *         FULFILMENT"). Final status colours. Summary band.
 */
import styles from "./BoundedContextMap.module.css";

export type BoundedContextMapVersion = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type Status = "red" | "amber" | "green" | "purple" | "gray" | "unknown";

interface Region {
  id: string;
  pathD: string;
  status: Status;
  label: string;
  sublabel?: string;
  findings?: string[];
  cx: number;
  cy: number;
  /** Drawn first if true */
  background?: boolean;
  /** Internal divider line — used for the v0.8 fusion memory */
  memoryLine?: { x1: number; y1: number; x2: number; y2: number };
}

interface Overlay {
  kind: "syncRibbon" | "asyncDotted" | "addressTendrils" | "returnsArrow";
  /** Label rendered only at the version that introduces the finding;
   *  passed as undefined on later versions where the line persists but
   *  the label would be redundant clutter. */
  label?: string;
}

interface ModelState {
  regions: Region[];
  overlays: Overlay[];
  caption: string;
  showSummaryBand: boolean;
}

// ── SHAPE PATHS ────────────────────────────────────────────────────────────

// v0.0 baseline: each context is a small gentle oval, all spread out
const SHIP_SMALL = "M 220 175 C 235 155, 265 145, 290 145 C 320 145, 345 155, 360 175 C 370 195, 365 215, 350 230 C 330 245, 295 248, 270 245 C 240 240, 215 225, 210 200 C 210 185, 215 178, 220 175 Z";
const CARR_SMALL = "M 545 175 C 560 155, 590 145, 615 145 C 645 145, 670 155, 685 175 C 695 195, 690 215, 675 230 C 655 245, 620 248, 595 245 C 565 240, 540 225, 535 200 C 535 185, 540 178, 545 175 Z";
const CONS_SMALL = "M 80 460 C 95 445, 120 438, 145 440 C 170 442, 190 452, 200 470 C 205 488, 200 502, 185 512 C 165 522, 135 522, 115 518 C 95 512, 78 500, 75 485 C 75 475, 78 465, 80 460 Z";
const INV_SMALL = "M 730 175 C 745 155, 775 145, 800 145 C 830 145, 855 155, 870 175 C 880 195, 875 215, 860 230 C 840 245, 805 248, 780 245 C 750 240, 725 225, 720 200 C 720 185, 725 178, 730 175 Z";
const INVOICING_SMALL = "M 285 460 C 300 445, 325 438, 350 440 C 375 442, 395 452, 405 470 C 410 488, 405 502, 390 512 C 370 522, 340 522, 320 518 C 300 512, 283 500, 280 485 C 280 475, 283 465, 285 460 Z";
const TRACK_SMALL = "M 905 460 C 920 445, 950 438, 980 440 C 1010 442, 1035 452, 1045 470 C 1050 488, 1045 502, 1030 512 C 1005 522, 970 522, 945 518 C 920 512, 902 500, 900 485 C 900 475, 902 465, 905 460 Z";

// v0.1-v0.7 developed shapes: Shipment as an irregular god-entity blob,
// Carrier as a separate oval, etc. They mostly stay in this form, only
// fills/findings/overlays change.
const SHIP_DEV =
  "M 175 145 C 195 125, 220 110, 260 105 C 310 100, 360 105, 395 120 " +
  "C 420 140, 435 170, 430 200 C 432 240, 415 280, 395 295 " +
  "C 360 310, 320 320, 280 318 C 240 315, 200 305, 180 290 " +
  "C 155 265, 145 230, 145 200 C 145 175, 160 155, 175 145 Z";
const CARR_DEV =
  "M 510 145 C 530 130, 560 115, 605 110 C 655 105, 695 115, 720 130 " +
  "C 745 150, 760 180, 758 205 C 760 240, 745 275, 720 290 " +
  "C 685 305, 645 315, 615 313 C 580 310, 545 300, 525 285 " +
  "C 505 265, 495 230, 495 200 C 495 175, 500 155, 510 145 Z";

// v0.8 merged blob — Shipment + Carrier as one bilobed shape
const SHIP_FULFIL =
  "M 230 130 C 270 110, 290 100, 320 100 C 360 95, 400 95, 420 95 " +
  "C 430 100, 435 110, 442 108 C 449 110, 454 95, 464 95 " +
  "C 480 95, 520 95, 560 100 C 600 100, 640 115, 660 130 " +
  "C 690 150, 710 180, 710 200 C 710 230, 695 270, 660 290 " +
  "C 620 310, 580 320, 530 320 C 470 320, 420 320, 360 320 " +
  "C 310 320, 260 310, 220 290 C 195 270, 175 230, 175 200 " +
  "C 175 175, 195 150, 230 130 Z";

// Inventory developed (v0.2+) — bigger, with a corner that dips into Shipment
const INV_DEV =
  "M 600 230 C 660 220, 720 215, 770 225 C 820 235, 870 250, 880 280 " +
  "C 885 320, 880 360, 870 385 C 850 415, 790 430, 750 432 " +
  "C 700 430, 650 420, 615 405 C 590 385, 580 350, 580 320 " +
  "C 580 290, 585 250, 600 230 Z";

// Consignee developed (v0.2+) — clean rounded oval, stays small
const CONS_DEV =
  "M 60 460 C 75 435, 100 422, 130 420 C 165 418, 200 425, 215 445 " +
  "C 230 465, 230 490, 215 510 C 195 530, 160 535, 130 532 " +
  "C 100 530, 75 520, 60 505 C 50 490, 50 475, 60 460 Z";

// Invoicing developed (v0.2+) — medium oval, bottom-center-left
const INVOICING_DEV =
  "M 280 440 C 305 422, 340 415, 380 418 C 425 422, 460 432, 475 455 " +
  "C 485 480, 480 510, 460 525 C 430 540, 390 545, 360 542 " +
  "C 320 538, 285 525, 270 505 C 260 485, 265 458, 280 440 Z";

// Tracking developed (v0.2+) — small elongated, far right, gray
const TRACK_DEV =
  "M 880 480 C 905 462, 945 455, 985 458 C 1025 462, 1055 472, 1062 495 " +
  "C 1065 515, 1055 532, 1030 540 C 990 548, 945 545, 910 538 " +
  "C 885 530, 870 510, 870 498 C 870 488, 875 482, 880 480 Z";

// Returns/Policy (v0.7+) — purple amorphous shape, materialises in
// previously empty middle-bottom
const RETURNS_PATH =
  "M 530 480 C 555 462, 590 455, 625 460 C 665 466, 700 482, 712 510 " +
  "C 718 540, 705 568, 680 580 C 645 592, 605 595, 570 590 " +
  "C 535 583, 510 565, 505 540 C 503 515, 512 495, 530 480 Z";

// Two unknown ??? blobs — dashed fuzzy
const UNK_LEFT =
  "M 50 600 C 70 588, 105 583, 138 588 C 168 593, 195 605, 200 620 " +
  "C 203 638, 188 650, 165 652 C 130 656, 95 648, 72 638 " +
  "C 55 630, 48 618, 50 608 C 48 602, 48 600, 50 600 Z";
const UNK_RIGHT =
  "M 870 600 C 895 588, 935 583, 970 588 C 1010 593, 1045 605, 1055 620 " +
  "C 1062 638, 1045 652, 1015 654 C 980 656, 940 648, 910 638 " +
  "C 885 630, 870 618, 870 608 C 870 602, 870 600, 870 600 Z";

// ── PER-VERSION STATE ──────────────────────────────────────────────────────

const CAPTIONS: Record<BoundedContextMapVersion, string> = {
  0: "Hypothesis v0.0 — We know nothing yet.",
  1: "Hypothesis v0.1 — What the contracts declared.",
  2: "Hypothesis v0.2 — What the database reveals beneath.",
  3: "Hypothesis v0.3 — What commits together. What blocks extraction.",
  4: "Hypothesis v0.4 — What actually happens at runtime.",
  5: "Hypothesis v0.5 — The cost of wrong boundaries.",
  6: "Hypothesis v0.6 — Where data drifts and events are missing.",
  7: "Hypothesis v0.7 — Business rules nobody documented. One new context.",
  8: "Hypothesis v0.8 — Eight lenses. One evidence-backed hypothesis.",
};

/** Helpers — status accumulates across versions. */
function shipmentStatus(v: number): Status {
  if (v === 0) return "gray";
  return "amber"; // v0.1+ remains amber until merged into Shipment Fulfilment at v0.8
}
function carrierStatus(v: number): Status {
  if (v === 0) return "gray";
  if (v === 1 || v === 2) return "amber"; // dead boundary suspicion
  if (v >= 3 && v <= 7) return "green";   // READY from v0.3 transactions onward
  return "red";                            // v0.8: not actually rendered as separate; merge happens
}
function consigneeStatus(v: number): Status {
  if (v === 0) return "gray";
  if (v === 1) return "amber";  // "0 events" suspicion
  if (v === 2 || v === 3 || v === 4) return "amber";  // facade still suspected
  return "green";  // v0.5+ confirmed clean (0 incidents)
}
function inventoryStatus(v: number): Status {
  if (v === 0 || v === 1) return "gray";
  return "red"; // v0.2+ — 2 writers, boundary violation, stays red
}
function invoicingStatus(v: number): Status {
  if (v === 0) return "gray";
  return "amber"; // v0.1+ remains amber (moderate coupling)
}
function trackingStatus(v: number): Status {
  if (v === 0) return "gray";
  if (v === 1 || v === 2 || v === 3) return "amber"; // "infra?" suspicion
  return "gray"; // v0.4+ — silent participant / infrastructure
}

function shipmentFindings(v: number): string[] {
  const f: string[] = [];
  if (v >= 1) f.push("⚠ god entity");
  if (v >= 3) f.push("BLOCKED ✗");
  if (v >= 7) f.push("⚠ 891 overrides");
  return f;
}
function carrierFindings(v: number): string[] {
  const f: string[] = [];
  if (v >= 1) f.push("↔ circular");
  if (v >= 3 && v <= 7) f.push("READY ✓");
  return f;
}
function consigneeFindings(v: number): string[] {
  const f: string[] = [];
  if (v >= 1) f.push("0 events");
  if (v >= 2 && v <= 4) f.push("facade");
  if (v >= 5) {
    // replace earlier "0 events" with confirmed clean
    return ["clean ✓", "0 incidents"];
  }
  return f;
}
function inventoryFindings(v: number): string[] {
  const f: string[] = [];
  if (v >= 2) f.push("2 writers");
  if (v >= 3) f.push("BLOCKED ✗");
  return f;
}
function invoicingFindings(v: number): string[] {
  const f: string[] = [];
  if (v >= 8) f.push("41% co-change");
  return f;
}
function trackingFindings(v: number): string[] {
  if (v >= 4) return ["silent participant"];
  if (v >= 1) return ["infra?"];
  return [];
}

/** Build the full render state for a given version. */
function buildState(v: BoundedContextMapVersion): ModelState {
  const regions: Region[] = [];
  const overlays: Overlay[] = [];

  // v0.0 — six small ovals, all gray, separate
  if (v === 0) {
    regions.push(
      { id: "shipment", pathD: SHIP_SMALL, status: "gray", label: "Shipment", cx: 280, cy: 195 },
      { id: "carrier", pathD: CARR_SMALL, status: "gray", label: "Carrier", cx: 610, cy: 195 },
      { id: "inventory", pathD: INV_SMALL, status: "gray", label: "Inventory", cx: 795, cy: 195 },
      { id: "consignee", pathD: CONS_SMALL, status: "gray", label: "Consignee", cx: 140, cy: 478 },
      { id: "invoicing", pathD: INVOICING_SMALL, status: "gray", label: "Invoicing", cx: 345, cy: 478 },
      { id: "tracking", pathD: TRACK_SMALL, status: "gray", label: "Tracking", cx: 970, cy: 478 },
    );
  }
  // v0.1-v0.7 — developed shapes (Shipment now god entity, etc.)
  else if (v <= 7) {
    regions.push(
      // Shipment background, then Carrier so it overlaps Shipment on the right
      { id: "shipment", pathD: SHIP_DEV, status: shipmentStatus(v), label: "Shipment",
        findings: shipmentFindings(v), cx: 285, cy: 210, background: true },
      { id: "carrier", pathD: CARR_DEV, status: carrierStatus(v), label: "Carrier",
        findings: carrierFindings(v), cx: 625, cy: 210 },
      { id: "inventory", pathD: v >= 2 ? INV_DEV : INV_SMALL,
        status: inventoryStatus(v), label: "Inventory",
        findings: inventoryFindings(v), cx: v >= 2 ? 735 : 795, cy: v >= 2 ? 320 : 195 },
      { id: "consignee", pathD: CONS_DEV, status: consigneeStatus(v), label: "Consignee",
        findings: consigneeFindings(v), cx: 140, cy: 478 },
      { id: "invoicing", pathD: INVOICING_DEV, status: invoicingStatus(v), label: "Invoicing",
        findings: invoicingFindings(v), cx: 370, cy: 480 },
      { id: "tracking", pathD: TRACK_DEV, status: trackingStatus(v), label: "Tracking",
        findings: trackingFindings(v), cx: 968, cy: 502 },
    );

    if (v >= 7) {
      regions.push({
        id: "returns",
        pathD: RETURNS_PATH,
        status: "purple",
        label: "RETURNS",
        sublabel: "/ POLICY",
        findings: ["NEW · from G", "DEL-E011"],
        cx: 608,
        cy: 525,
      });
    }
  }
  // v0.8 — merged blob, Returns visible, final state
  else {
    regions.push(
      { id: "shipment-fulfilment", pathD: SHIP_FULFIL, status: "red",
        label: "SHIPMENT FULFILMENT",
        sublabel: "= Shipment ⊕ Carrier  (72% co-change)",
        findings: ["⚠ god entity", "⚠ saga needed before extraction", "⚠ 891 overrides"],
        cx: 440, cy: 195, background: true,
        memoryLine: { x1: 442, y1: 110, x2: 442, y2: 320 } },
      { id: "inventory", pathD: INV_DEV, status: "red", label: "INVENTORY",
        findings: ["2 writers", "shared w/ Ship"], cx: 735, cy: 320 },
      { id: "consignee", pathD: CONS_DEV, status: "green", label: "CONSIGNEE",
        findings: ["clean ✓", "89% solo"], cx: 140, cy: 478 },
      { id: "invoicing", pathD: INVOICING_DEV, status: "amber", label: "INVOICING",
        findings: ["41% co-change"], cx: 370, cy: 480 },
      { id: "returns", pathD: RETURNS_PATH, status: "purple", label: "RETURNS",
        sublabel: "/ POLICY", findings: ["NEW · from G", "DEL-E011"], cx: 608, cy: 525 },
      { id: "tracking", pathD: TRACK_DEV, status: "gray", label: "TRACKING",
        findings: ["silent participant"], cx: 968, cy: 502 },
    );
  }

  // Unknowns (all versions — start tiny on v0.0, slightly bigger from v0.1)
  regions.push(
    { id: "unknown-left", pathD: UNK_LEFT, status: "unknown", label: "???", cx: 125, cy: 622 },
    { id: "unknown-right", pathD: UNK_RIGHT, status: "unknown", label: "???", cx: 965, cy: 622 },
  );

  // Overlays per version — labels only appear at the version that
  // introduces the finding; the lines themselves stay through later
  // versions as visual memory.
  if (v === 4) overlays.push({ kind: "syncRibbon", label: "SYNC 2s" });
  if (v >= 4) overlays.push({ kind: "asyncDotted", label: v === 4 ? "ASYNC 87s" : undefined });
  if (v >= 6) overlays.push({ kind: "addressTendrils", label: v === 6 ? "342 mismatches" : undefined });
  if (v >= 7) overlays.push({ kind: "returnsArrow", label: v === 7 ? "DEL-E011" : undefined });

  return {
    regions,
    overlays,
    caption: CAPTIONS[v],
    showSummaryBand: v === 8,
  };
}

const STATUS_CLASS: Record<Status, string> = {
  red: "statusRed",
  amber: "statusAmber",
  green: "statusGreen",
  purple: "statusPurple",
  gray: "statusGray",
  unknown: "statusUnknown",
};

function parseVersion(raw: string | number): BoundedContextMapVersion {
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 8) return 8;
  return n as BoundedContextMapVersion;
}

interface Props {
  version: BoundedContextMapVersion | number | string;
}

export function BoundedContextMap({ version }: Props) {
  const v = parseVersion(version);
  const state = buildState(v);

  // Draw order: background regions first
  const bg = state.regions.filter((r) => r.background);
  const fg = state.regions.filter((r) => !r.background);
  const ordered = [...bg, ...fg];

  return (
    <figure className={styles.figure}>
      <div className={styles.canvas}>
        <svg
          viewBox="0 0 1100 700"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Region fills + strokes — each group scaled 1.1× around the
              region's centroid so the larger 20px region labels and 14px
              findings have breathing room inside the shape outline. The
              labels themselves are rendered in a separate <g> below so
              they stay at their original centroid (not double-scaled). */}
          {ordered.map((r) => (
            <g
              key={`shape-${r.id}`}
              className={styles[STATUS_CLASS[r.status]]}
              transform={`translate(${r.cx} ${r.cy}) scale(1.1) translate(${-r.cx} ${-r.cy})`}
            >
              <path d={r.pathD} className={styles.regionPath} />
              {r.memoryLine && (
                <line
                  x1={r.memoryLine.x1}
                  y1={r.memoryLine.y1}
                  x2={r.memoryLine.x2}
                  y2={r.memoryLine.y2}
                  className={styles.memoryLine}
                />
              )}
            </g>
          ))}

          {/* Overlays */}
          {state.overlays.map((o, i) => {
            if (o.kind === "syncRibbon") {
              return (
                <g key={`ov-${i}`} className={styles.syncRibbon}>
                  <path
                    d="M 285 240 C 400 260, 500 280, 600 320 C 680 350, 600 420, 460 470 C 380 490, 320 490, 320 470"
                    fill="none"
                    strokeWidth="22"
                  />
                  <text x={500} y={395} className={styles.ribbonLabel} textAnchor="middle">
                    {o.label}
                  </text>
                </g>
              );
            }
            if (o.kind === "asyncDotted") {
              return (
                <g key={`ov-${i}`} className={styles.asyncDotted}>
                  <path
                    d="M 400 500 C 500 480, 580 360, 620 290"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="3 4"
                  />
                  {o.label && (
                    <text x={530} y={400} className={styles.asyncLabel} textAnchor="middle">
                      {o.label}
                    </text>
                  )}
                </g>
              );
            }
            if (o.kind === "addressTendrils") {
              return (
                <g key={`ov-${i}`} className={styles.addressTendrils}>
                  <path d="M 200 460 C 260 380, 320 280, 285 210" fill="none" strokeDasharray="2 3" strokeWidth="1.5" />
                  <path d="M 215 445 C 350 320, 500 220, 620 210" fill="none" strokeDasharray="2 3" strokeWidth="1.5" />
                  <path d="M 195 490 C 250 480, 330 478, 380 480" fill="none" strokeDasharray="2 3" strokeWidth="1.5" />
                  {o.label && (
                    <text x={420} y={335} className={styles.addressLabel} textAnchor="middle">
                      {o.label}
                    </text>
                  )}
                </g>
              );
            }
            if (o.kind === "returnsArrow") {
              // Starts clearly INSIDE Carrier (cy=210 is Carrier's centre)
              // and arcs down to the top of the Returns/Policy blob.
              return (
                <g key={`ov-${i}`} className={styles.returnsArrow}>
                  <path d="M 605 225 C 625 320, 630 410, 610 478" fill="none" strokeWidth="2" />
                  <polygon points="603,476 617,476 610,490" />
                  {o.label && (
                    <text x={665} y={395} className={styles.returnsLabel} textAnchor="middle">
                      {o.label}
                    </text>
                  )}
                </g>
              );
            }
            return null;
          })}

          {/* Labels on top */}
          {ordered.map((r) => {
            const subOffset = r.sublabel ? 18 : 0;
            const findingsStart = r.cy + subOffset + 22;
            return (
              <g key={`label-${r.id}`} className={styles[STATUS_CLASS[r.status]]}>
                <text x={r.cx} y={r.cy} className={styles.regionLabel} textAnchor="middle">
                  {r.label}
                </text>
                {r.sublabel && (
                  <text x={r.cx} y={r.cy + 18} className={styles.regionSublabel} textAnchor="middle">
                    {r.sublabel}
                  </text>
                )}
                {r.findings?.map((f, i) => (
                  <text
                    key={i}
                    x={r.cx}
                    y={findingsStart + i * 16}
                    className={styles.regionFinding}
                    textAnchor="middle"
                  >
                    {f}
                  </text>
                ))}
              </g>
            );
          })}

          {/* v0.8 only: ghost-of-Shipment + ghost-of-Carrier struck-through */}
          {v === 8 && (
            <g className={styles.statusRed}>
              <text x={290} y={155} className={styles.mergedGhostLabel} textAnchor="middle">
                <tspan className={styles.mergedStrike}>Shipment</tspan>
              </text>
              <text x={590} y={155} className={styles.mergedGhostLabel} textAnchor="middle">
                <tspan className={styles.mergedStrike}>Carrier</tspan>
              </text>
            </g>
          )}

          {/* Exhibit tag in the top-right corner of the canvas — small
              anchor so the audience always knows which exhibit just landed. */}
          {v >= 1 && (
            <text x={1060} y={50} className={styles.exhibitTag} textAnchor="end">
              {`[${["A", "B", "C", "D", "E", "F", "G", "H"][v - 1]}]`}
            </text>
          )}
        </svg>
      </div>

      {state.showSummaryBand && (
        <div className={styles.summaryBand}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Remembered</div>
            <div className={styles.summaryValue}>3</div>
            <div className={styles.summaryDetail}>contexts (Event Storming)</div>
          </div>
          <div className={styles.summaryDivider}>/</div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Discovered</div>
            <div className={styles.summaryValue}>7</div>
            <div className={styles.summaryDetail}>contexts (8 exhibits)</div>
          </div>
        </div>
      )}

      <figcaption className={styles.caption}>{state.caption}</figcaption>
    </figure>
  );
}
