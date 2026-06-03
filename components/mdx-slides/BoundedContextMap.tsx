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

export type BoundedContextMapVersion = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
  kind:
    | "syncRibbon"
    | "asyncDotted"
    | "returnsArrow"
    | "incidentFan"
    | "deadBoundaryLine"
    | "facadeBypass"
    | "sharedKernel"
    | "deadBoundaryProved"
    | "extractionBlocker";
// Note: 'addressTendrils' was the v=6 data-lineage overlay used by the
// now-removed Exhibit F (Data Lineage). After F was cut, the overlay
// kind is removed from the union. CSS class lingers as dead code; safe
// to prune in a later pass.
  /** Label rendered only at the version that introduces the finding;
   *  passed as undefined on later versions where the line persists but
   *  the label would be redundant clutter. */
  label?: string;
}

interface Legend {
  header: string;
  items: { marker: "red" | "green" | "amber" | "purple"; text: string }[];
}

interface ModelState {
  regions: Region[];
  overlays: Overlay[];
  /** Optional HTML legend rendered below the canvas (between the SVG
   *  and the figcaption). Lives outside the SVG so it never competes
   *  with shapes for room. */
  legend?: Legend;
  caption: string;
  showSummaryBand: boolean;
}

// ── SHAPE PATHS ────────────────────────────────────────────────────────────

// v0.0 baseline: each context is a small gentle oval, all spread out
const SHIP_SMALL = "M 220 175 C 235 155, 265 145, 290 145 C 320 145, 345 155, 360 175 C 370 195, 365 215, 350 230 C 330 245, 295 248, 270 245 C 240 240, 215 225, 210 200 C 210 185, 215 178, 220 175 Z";
const CARR_SMALL = "M 545 175 C 560 155, 590 145, 615 145 C 645 145, 670 155, 685 175 C 695 195, 690 215, 675 230 C 655 245, 620 248, 595 245 C 565 240, 540 225, 535 200 C 535 185, 540 178, 545 175 Z";
const CONS_SMALL = "M 80 460 C 95 445, 120 438, 145 440 C 170 442, 190 452, 200 470 C 205 488, 200 502, 185 512 C 165 522, 135 522, 115 518 C 95 512, 78 500, 75 485 C 75 475, 78 465, 80 460 Z";
// Inventory v0.0/v0.1 — pushed to the right-hand corner so it stays
// clear of Carrier. Earlier position (cx 795) sat too close to Carrier's
// right edge and visually overlapped after the 1.1× shape scaling.
const INV_SMALL = "M 810 175 C 825 155, 855 145, 880 145 C 910 145, 935 155, 950 175 C 960 195, 955 215, 940 230 C 920 245, 885 248, 860 245 C 830 240, 805 225, 800 200 C 800 185, 805 178, 810 175 Z";
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

// Inventory developed (v0.2+) — moved to the far right column so it
// no longer overlaps Carrier. Previous shape stretched x 580–885 which
// sat right inside Carrier's bounding box. New shape sits cleanly
// between Carrier (right edge ~760) and the right viewBox edge (1100),
// vertically at mid-height so Tracking stays clear below.
const INV_DEV =
  "M 855 240 C 880 220, 910 210, 940 208 C 975 207, 1005 218, 1025 235 " +
  "C 1045 258, 1052 290, 1048 320 C 1050 350, 1038 380, 1015 395 " +
  "C 985 410, 945 415, 915 412 C 885 408, 860 398, 850 380 " +
  "C 838 358, 832 325, 835 295 C 835 275, 842 255, 855 240 Z";

// Consignee developed (v0.1+) — now carries 2-line v0.1 findings
// ('0 events' + 'published language?') plus the label, so the shape
// is significantly taller than the original. Width capped by the
// gap to Invoicing on the right (after 1.1× scaling). Height grows
// downward and upward.
const CONS_DEV =
  "M 50 420 C 70 398, 100 390, 130 388 C 162 386, 195 396, 210 418 " +
  "C 225 442, 225 515, 210 535 C 193 555, 162 562, 130 558 " +
  "C 100 555, 70 543, 50 525 C 38 498, 38 445, 50 420 Z";

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

// Two unknown blobs — dashed fuzzy. Enlarged from the original 150-wide
// ??? placeholders so they can hold the descriptive labels we adopted
// instead of '???'. Left blob = the internal contexts we know exist
// but have no contracts for (Carrier Routing, Customs, Returns until
// v0.7). Right blob = third-party / external integrations.
const UNK_LEFT =
  "M 35 595 C 58 580, 95 575, 135 580 " +
  "C 175 585, 205 598, 215 618 " +
  "C 218 638, 200 655, 170 657 " +
  "C 130 660, 88 655, 60 645 " +
  "C 40 638, 30 624, 35 612 " +
  "C 30 605, 30 600, 35 595 Z";
const UNK_RIGHT =
  "M 875 595 C 898 580, 935 575, 975 580 " +
  "C 1015 585, 1045 598, 1055 618 " +
  "C 1058 638, 1040 655, 1010 657 " +
  "C 970 660, 928 655, 900 645 " +
  "C 880 638, 870 624, 875 612 " +
  "C 870 605, 870 600, 875 595 Z";

// ── PER-VERSION STATE ──────────────────────────────────────────────────────

const CAPTIONS: Record<BoundedContextMapVersion, string> = {
  0: "Hypothesis v0.0 — We know nothing yet.",
  1: "Hypothesis v0.1 — What the contracts declared.",
  2: "Hypothesis v0.2 — What the database reveals beneath.",
  3: "Hypothesis v0.3 — What commits together. What blocks extraction.",
  4: "Hypothesis v0.4 — What actually happens at runtime.",
  5: "Hypothesis v0.5 — The cost of wrong boundaries.",
  6: "Hypothesis v0.6 — Business rules nobody documented. One new context.",
  7: "Hypothesis v0.7 — Seven lenses. One evidence-backed hypothesis.",
};

/** Helpers — status accumulates across versions. */
function shipmentStatus(v: number): Status {
  if (v === 0) return "gray";
  return "amber"; // v0.1+ remains amber until merged into Shipment Fulfilment at v0.7
}
function carrierStatus(v: number): Status {
  if (v === 0) return "gray";
  if (v === 1 || v === 2) return "amber"; // dead boundary suspicion
  if (v >= 3 && v <= 6) return "green";   // extractable from v0.3 transactions onward
  return "red";                            // v0.7: not actually rendered as separate; merge happens
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
  // v0.3 — name the aggregate that C's transaction clustering surfaced.
  // Prepended as the first line; speaker notes carry the table membership.
  if (v === 3) return ["Order Aggregate", "⚠ god entity", "BLOCKED ✗"];
  const f: string[] = [];
  if (v >= 1) f.push("⚠ god entity");
  if (v >= 3) f.push("BLOCKED ✗");
  // Incident counts ('54 incidents · epicentre' at v>=5) and override
  // counts ('⚠ 891 overrides' at v>=6) deliberately NOT pushed —
  // those are tech-debt metrics. The legend below the canvas carries
  // them as evidence; the circles show only DDD verdicts.
  return f;
}
function carrierFindings(v: number): string[] {
  // v0.3 — name Carrier's aggregate emerging from C; verdict carries.
  // Renamed from 'Shipment Aggregate' to 'Delivery Aggregate' — the
  // underlying tables are called shipments/tracking_events but Carrier's
  // job is physical delivery tracking, and 'Shipment Aggregate inside
  // Carrier' reads broken on stage given there's also a Shipment service.
  if (v === 3) return ["Delivery Aggregate", "↔ circular", "extractable ✓"];
  const f: string[] = [];
  if (v >= 1) f.push("↔ circular");
  if (v >= 3 && v <= 6) f.push("extractable ✓");
  // Incident count '17 incidents · w/ Ship' at v>=5 deliberately NOT
  // pushed — tech-debt metric. The legend carries it as evidence;
  // the circle shows only DDD verdicts.
  return f;
}
function consigneeFindings(v: number): string[] {
  // v0.1 — Exhibit A finds 0 events + published-language hypothesis.
  if (v === 1) return ["0 events", "published language?"];
  // v0.2 — Exhibit B refutes the hypothesis. The struck-through marker
  // (~~text~~) renders with a line-through; visible only on this version
  // to mark the moment of refutation, then dropped from v=3 onward to
  // keep the model clean.
  if (v === 2) return ["0 events", "~~published language?~~", "facade"];
  // v0.3-v0.4 — facade verdict carries forward without the struck-through
  // historical hypothesis. C's transaction lens adds the extractable
  // verdict — Consignee's internal commits are clean, so the context
  // can be extracted (the 3 consumer bypasses are a separate fix).
  if (v >= 3 && v <= 4) return ["0 events", "facade", "extractable ✓"];
  // v0.5+ — confirmed clean. 'clean ✓' carries the DDD verdict; the
  // raw '0 incidents' metric belongs in the legend, not the circle.
  return ["clean ✓"];
}
function inventoryFindings(v: number): string[] {
  // v0.2 — Exhibit B surfaces the disputed-aggregate hypothesis from the
  // inventory_reserved 2-writer evidence. The table name on its own line
  // makes the hypothesis concrete — points at the specific aggregate
  // boundary in question.
  if (v === 2) return ["2 writers", "disputed aggregate?", "(inventory_reserved)"];
  // v0.3 — C's transaction clustering names Inventory's aggregate;
  // BLOCKED verdict supersedes the v0.2 hypothesis.
  if (v === 3) return ["Reservation Aggregate", "2 writers", "BLOCKED ✗"];
  // v0.4+ — verdict carries forward without the aggregate label.
  const f: string[] = [];
  if (v >= 4) {
    f.push("2 writers");
    f.push("BLOCKED ✗");
  }
  // Incident count '23 incidents · w/ Ship' at v>=5 deliberately NOT
  // pushed — tech-debt metric. Legend carries it as evidence.
  return f;
}
function invoicingFindings(v: number): string[] {
  // v0.3 — C's transaction clustering names Invoicing's Payment Aggregate.
  if (v === 3) return ["Payment Aggregate"];
  // Tech-debt metrics deliberately NOT pushed:
  //   '14 incidents · w/ Ship' (v>=5)
  //   '41% co-change'          (v>=7)
  // Both live in the relevant legends. The circle stays empty post-v=3
  // — no DDD verdict to add until the final merge state at v=7.
  return [];
}
function trackingFindings(v: number): string[] {
  if (v >= 4) return ["silent participant"];
  // v0.1-v0.3 — the activity surfaces 'owns no domain entities' as the
  // observation; 'generic subdomain?' is the hypothesis. Phrased as a
  // question because contracts alone don't confirm it.
  if (v >= 1) return ["generic subdomain?"];
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
      { id: "inventory", pathD: INV_SMALL, status: "gray", label: "Inventory", cx: 875, cy: 195 },
      { id: "consignee", pathD: CONS_SMALL, status: "gray", label: "Consignee", cx: 140, cy: 478 },
      { id: "invoicing", pathD: INVOICING_SMALL, status: "gray", label: "Invoicing", cx: 345, cy: 478 },
      { id: "tracking", pathD: TRACK_SMALL, status: "gray", label: "Tracking", cx: 970, cy: 478 },
    );
  }
  // v0.1-v0.6 — developed shapes (Shipment now god entity, etc.)
  else if (v <= 6) {
    regions.push(
      // Shipment background, then Carrier so it overlaps Shipment on the right
      { id: "shipment", pathD: SHIP_DEV, status: shipmentStatus(v), label: "Shipment",
        findings: shipmentFindings(v), cx: 285, cy: 210, background: true },
      { id: "carrier", pathD: CARR_DEV, status: carrierStatus(v), label: "Carrier",
        findings: carrierFindings(v), cx: 625, cy: 210 },
      { id: "inventory", pathD: v >= 2 ? INV_DEV : INV_SMALL,
        status: inventoryStatus(v), label: "Inventory",
        findings: inventoryFindings(v), cx: v >= 2 ? 940 : 875, cy: v >= 2 ? 320 : 195 },
      { id: "consignee", pathD: CONS_DEV, status: consigneeStatus(v), label: "Consignee",
        findings: consigneeFindings(v), cx: 140, cy: 478 },
      { id: "invoicing", pathD: INVOICING_DEV, status: invoicingStatus(v), label: "Invoicing",
        findings: invoicingFindings(v), cx: 370, cy: 480 },
      { id: "tracking", pathD: TRACK_DEV, status: trackingStatus(v), label: "Tracking",
        findings: trackingFindings(v), cx: 968, cy: 502 },
    );

    if (v >= 6) {
      regions.push({
        id: "returns",
        pathD: RETURNS_PATH,
        status: "purple",
        label: "RETURNS",
        sublabel: "/ POLICY",
        findings: ["NEW · from F", "DEL-E011"],
        cx: 608,
        cy: 525,
      });
    }
  }
  // v0.7 — merged blob, Returns visible, final state
  else {
    regions.push(
      { id: "shipment-fulfilment", pathD: SHIP_FULFIL, status: "red",
        label: "SHIPMENT FULFILMENT",
        sublabel: "= Shipment ⊕ Carrier  (72% co-change)",
        // '⚠ 891 overrides' dropped — tech-debt count. The DDD verdicts
        // (god entity + saga-needed) stay.
        findings: ["⚠ god entity", "⚠ saga needed before extraction"],
        cx: 440, cy: 195, background: true,
        memoryLine: { x1: 442, y1: 110, x2: 442, y2: 320 } },
      { id: "inventory", pathD: INV_DEV, status: "red", label: "INVENTORY",
        findings: ["2 writers", "shared w/ Ship"], cx: 940, cy: 320 },
      { id: "consignee", pathD: CONS_DEV, status: "green", label: "CONSIGNEE",
        // '89% solo' dropped — tech-debt git metric. 'clean ✓' carries
        // the DDD verdict.
        findings: ["clean ✓"], cx: 140, cy: 478 },
      { id: "invoicing", pathD: INVOICING_DEV, status: "amber", label: "INVOICING",
        // '41% co-change' dropped — tech-debt git metric. Empty findings;
        // the coupling shows visually + in the summary band.
        cx: 370, cy: 480 },
      { id: "returns", pathD: RETURNS_PATH, status: "purple", label: "RETURNS",
        sublabel: "/ POLICY", findings: ["NEW · from F", "DEL-E011"], cx: 608, cy: 525 },
      { id: "tracking", pathD: TRACK_DEV, status: "gray", label: "TRACKING",
        findings: ["silent participant"], cx: 968, cy: 502 },
    );
  }

  // Unknowns — internal contexts we know about but have no contracts for
  // (left), and third-party / external integrations (right). At v0.6+ the
  // left blob drops 'Returns' from its sublabel because Returns/Policy
  // materialises as its own purple shape via DEL-E011 evidence.
  regions.push(
    { id: "unknown-left", pathD: UNK_LEFT, status: "unknown",
      label: "Carrier Routing",
      sublabel: v >= 6 ? "· Customs" : "· Customs · Returns",
      cx: 122, cy: 605 },
    { id: "unknown-right", pathD: UNK_RIGHT, status: "unknown",
      label: "External Systems", cx: 965, cy: 614 },
  );

  // Overlays draw on the canvas — lines/ribbons/arrows that carry the
  // *visual* signal. Each overlay appears ONLY on the version that
  // introduces the finding. The cumulative state of the model is
  // carried by shape colours + findings inside the cards; persisting
  // overlay paths without their legend (which appears only at the
  // introducing version) would be unexplained noise.
  if (v === 1) overlays.push({ kind: "deadBoundaryLine" });
  if (v === 2) overlays.push({ kind: "facadeBypass" });
  if (v === 2) overlays.push({ kind: "sharedKernel" });
  if (v === 3) overlays.push({ kind: "deadBoundaryProved" });
  if (v === 3) overlays.push({ kind: "extractionBlocker" });
  if (v === 4) overlays.push({ kind: "syncRibbon" });
  if (v === 4) overlays.push({ kind: "asyncDotted" });
  if (v === 5) overlays.push({ kind: "incidentFan" });
  if (v === 6) overlays.push({ kind: "returnsArrow" });

  // Legend per version — explains the overlays in words. Sits below
  // the canvas as HTML, always has room, never overlaps shapes.
  let legend: Legend | undefined;
  if (v === 1) {
    legend = {
      header: "Hypothesis · from Exhibit A",
      items: [
        { marker: "amber", text: "Shipment ↔ Carrier · dead boundary?  (duplicate schema + circular refs)" },
      ],
    };
  } else if (v === 2) {
    legend = {
      header: "Database-layer findings · from Exhibit B",
      items: [
        { marker: "red", text: "3 services bypass Consignee API · facade boundary confirmed" },
        { marker: "red", text: "Shipment ↔ Inventory · shared write on inventory_reserved (2 writers)" },
      ],
    };
  } else if (v === 3) {
    legend = {
      header: "Transaction-layer findings · from Exhibit C",
      items: [
        { marker: "red", text: "Shipment ↔ Carrier · dead boundary proved (2,103 co-writes/wk)" },
        { marker: "red", text: "Shipment ↔ Inventory · extraction blocker (4,512/wk · 580ms same commit)" },
      ],
    };
  } else if (v === 4) {
    legend = {
      header: "Runtime flow",
      items: [
        { marker: "red", text: "Sync chain · 2s — Shipment → Inventory → Invoicing" },
        { marker: "green", text: "Async gap · 87s — → Carrier" },
      ],
    };
  } else if (v === 5) {
    legend = {
      header: "Incident clustering · coupling strength",
      items: [
        { marker: "red", text: "Shipment ↔ Inventory · 23 incidents · 4 SEV1 · structural coupling" },
        { marker: "red", text: "Shipment ↔ Carrier · 17 incidents · structural coupling" },
        { marker: "red", text: "Shipment ↔ Invoicing · 14 incidents · moderate coupling" },
        { marker: "green", text: "Consignee boundary · 0 incidents · clean" },
      ],
    };
  } else if (v === 6) {
    legend = {
      header: "Discovery · from Exhibit F",
      items: [
        { marker: "purple", text: "Returns / Policy revealed by DEL-E011 in Carrier — a new bounded context" },
      ],
    };
  }

  return {
    regions,
    overlays,
    legend,
    caption: CAPTIONS[v],
    showSummaryBand: v === 7,
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

          {/* Overlays — draw lines/ribbons/arrows only. No text labels
              on them. Their meaning is carried by the HTML legend below
              the canvas. */}
          {state.overlays.map((o, i) => {
            if (o.kind === "syncRibbon") {
              // Translucent red band tracing the sync chain
              // Shipment → Inventory → Invoicing. Routed BELOW Carrier
              // because Carrier is intentionally NOT on the sync chain.
              // Inventory now sits in the far-right column, so the
              // ribbon arcs out wider to reach it and then loops back
              // down-left to Invoicing.
              return (
                <g key={`ov-${i}`} className={styles.syncRibbon}>
                  <path
                    d="M 380 285 C 530 365, 720 365, 850 320 C 760 420, 580 470, 415 478"
                    fill="none"
                    strokeWidth="12"
                  />
                </g>
              );
            }
            if (o.kind === "asyncDotted") {
              // Green dotted line from Invoicing → Carrier with arrowhead
              // at the Carrier end. Tilted right so it stays clear of
              // the sync ribbon.
              return (
                <g key={`ov-${i}`} className={styles.asyncDotted}>
                  <path
                    d="M 470 470 C 530 400, 565 320, 590 240"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray="4 5"
                  />
                  <polygon points="582 245, 600 240, 593 256" />
                </g>
              );
            }
            if (o.kind === "incidentFan") {
              // Three red lines radiating from Shipment (the epicentre) to
              // Inventory, Carrier, and Invoicing — stroke widths
              // proportional to incident count. Makes the "Shipment is the
              // centre of the boundary failures" finding visceral.
              return (
                <g key={`ov-${i}`} className={styles.incidentFan}>
                  {/* Shipment → Inventory · 23 incidents (worst — thickest).
                      Inventory moved to far-right, so the arc reaches further. */}
                  <path d="M 380 245 C 500 280, 680 305, 850 320" fill="none" strokeWidth="7" />
                  {/* Shipment → Carrier · 17 incidents — through their overlap zone */}
                  <path d="M 385 190 C 440 188, 475 188, 510 192" fill="none" strokeWidth="5" />
                  {/* Shipment → Invoicing · 14 incidents */}
                  <path d="M 295 295 C 305 360, 340 415, 365 445" fill="none" strokeWidth="4" />
                </g>
              );
            }
            if (o.kind === "returnsArrow") {
              // Starts clearly INSIDE Carrier and arcs down to the top of
              // the Returns/Policy blob.
              return (
                <g key={`ov-${i}`} className={styles.returnsArrow}>
                  <path d="M 605 225 C 625 320, 630 410, 610 478" fill="none" strokeWidth="2" />
                  <polygon points="603,476 617,476 610,490" />
                </g>
              );
            }
            if (o.kind === "deadBoundaryLine") {
              // Amber dotted line in the gap between Shipment and Carrier.
              // Visualises the v0.1 hypothesis 'dead boundary?', earned by
              // Exhibit A's duplicate-schema evidence. Sits at the shared
              // y-axis (~210) so the line reads as a direct link.
              return (
                <g key={`ov-${i}`} className={styles.deadBoundaryLine}>
                  <line x1="440" y1="210" x2="495" y2="210"
                    strokeDasharray="6 5" strokeWidth="3" strokeLinecap="round" />
                </g>
              );
            }
            if (o.kind === "facadeBypass") {
              // Three red dashed lines from Shipment / Carrier / Invoicing
              // converging on Consignee's customer_addresses — the 3
              // services that read the table directly, bypassing the
              // Consignee API. v0.2 reveal.
              return (
                <g key={`ov-${i}`} className={styles.facadeBypass}>
                  {/* Shipment → Consignee */}
                  <path d="M 280 320 C 240 380, 200 420, 175 440"
                    fill="none" strokeWidth="2" strokeDasharray="6 5" />
                  {/* Carrier → Consignee (long diagonal across canvas) */}
                  <path d="M 525 290 C 420 380, 320 430, 210 450"
                    fill="none" strokeWidth="2" strokeDasharray="6 5" />
                  {/* Invoicing → Consignee (short horizontal-ish) */}
                  <path d="M 270 478 C 255 478, 240 478, 225 478"
                    fill="none" strokeWidth="2" strokeDasharray="6 5" />
                </g>
              );
            }
            if (o.kind === "sharedKernel") {
              // Single dashed line between Shipment and Inventory marking the
              // inventory_reserved shared-write coupling. Routed over Carrier
              // (above y 210) to avoid passing through it. v0.2 reveal.
              return (
                <g key={`ov-${i}`} className={styles.sharedKernel}>
                  <path d="M 395 220 C 540 180, 720 180, 845 260"
                    fill="none" strokeWidth="3" strokeDasharray="8 5" />
                </g>
              );
            }
            if (o.kind === "deadBoundaryProved") {
              // Red SOLID line in the gap between Shipment and Carrier (v0.3).
              // Promotes the v0.1 amber dotted hypothesis to a confirmed
              // verdict backed by Exhibit C's 2,103/wk co-write evidence.
              return (
                <g key={`ov-${i}`} className={styles.deadBoundaryProved}>
                  <line x1="440" y1="210" x2="495" y2="210"
                    strokeWidth="4" strokeLinecap="round" />
                </g>
              );
            }
            if (o.kind === "extractionBlocker") {
              // Red SOLID line between Shipment and Inventory (v0.3). Confirms
              // the v0.2 sharedKernel dashed link as an extraction blocker —
              // both services committing in the same transaction at 580ms.
              return (
                <g key={`ov-${i}`} className={styles.extractionBlocker}>
                  <path d="M 395 220 C 540 180, 720 180, 845 260"
                    fill="none" strokeWidth="4" strokeLinecap="round" />
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
                {r.findings?.map((f, i) => {
                  // ~~text~~ marker → render with line-through. Used for
                  // findings that were a hypothesis at the previous
                  // version and got refuted by the current version's
                  // evidence (e.g. Consignee 'published language?' at
                  // v0.2 when the facade lens refutes it).
                  const isStrike = f.startsWith("~~") && f.endsWith("~~");
                  const text = isStrike ? f.slice(2, -2) : f;
                  return (
                    <text
                      key={i}
                      x={r.cx}
                      y={findingsStart + i * 16}
                      className={
                        isStrike
                          ? `${styles.regionFinding} ${styles.regionFindingStrike}`
                          : styles.regionFinding
                      }
                      textAnchor="middle"
                    >
                      {text}
                    </text>
                  );
                })}
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

      {state.legend && (
        <div className={styles.legendBar}>
          <div className={styles.legendHeader}>{state.legend.header}</div>
          <ul className={styles.legendList}>
            {state.legend.items.map((item, i) => {
              const markerClass =
                item.marker === "red"
                  ? styles.markerRed
                  : item.marker === "green"
                    ? styles.markerGreen
                    : item.marker === "amber"
                      ? styles.markerAmber
                      : styles.markerPurple;
              return (
                <li key={i} className={styles.legendItem}>
                  <span className={`${styles.legendMarker} ${markerClass}`} />
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

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

    </figure>
  );
}
