/**
 * <BoundedContextMap />
 *
 * PROOF OF CONCEPT — v0.8 only, hardcoded.
 *
 * Renders the eight-exhibits final model as overlapping bounded-context
 * regions rather than the rectangular grid of <ContextMap />. Each
 * context is a hand-tuned SVG path (rounded polygon, organic but
 * coherent), filled semi-transparent so overlaps read as overlaps —
 * which is the whole point: overlap = coupling.
 *
 * If this lands visually, the component generalises to v0.0-v0.7 with
 * the same shapes but fewer overlaps / fewer findings / different
 * status colours per version, and replaces <ContextMap /> entirely.
 */
import styles from "./BoundedContextMap.module.css";

type Status = "red" | "amber" | "green" | "purple" | "gray" | "unknown";

interface Region {
  id: string;
  pathD: string;
  status: Status;
  label: string;
  sublabel?: string;
  findings?: string[];
  /** Centroid for label placement (viewBox coords, 0-1100 × 0-700) */
  cx: number;
  cy: number;
  /** Drawn first if true (background); regions on top of it appear over it */
  background?: boolean;
  /** Optional internal "memory line" (used for the Shipment+Carrier fusion) */
  memoryLine?: { x1: number; y1: number; x2: number; y2: number };
}

const REGIONS: Region[] = [
  {
    // SHIPMENT FULFILMENT — merged Shipment+Carrier, big, red,
    // subtle pinch in the top middle marks where they fused.
    id: "shipment-fulfilment",
    status: "red",
    pathD:
      "M 230 130 C 270 110, 290 100, 320 100 C 360 95, 400 95, 420 95 " +
      "C 430 100, 435 110, 442 108 C 449 110, 454 95, 464 95 " +
      "C 480 95, 520 95, 560 100 C 600 100, 640 115, 660 130 " +
      "C 690 150, 710 180, 710 200 C 710 230, 695 270, 660 290 " +
      "C 620 310, 580 320, 530 320 C 470 320, 420 320, 360 320 " +
      "C 310 320, 260 310, 220 290 C 195 270, 175 230, 175 200 " +
      "C 175 175, 195 150, 230 130 Z",
    label: "SHIPMENT FULFILMENT",
    sublabel: "= Shipment ⊕ Carrier  (72% co-change)",
    findings: ["⚠ god entity", "BLOCKED ✗", "⚠ 891 overrides"],
    cx: 440,
    cy: 195,
    background: true,
    memoryLine: { x1: 442, y1: 110, x2: 442, y2: 320 },
  },
  {
    // INVENTORY — red, overlaps Shipment Fulfilment from the right
    id: "inventory",
    status: "red",
    pathD:
      "M 600 230 C 660 220, 720 215, 770 225 C 820 235, 870 250, 880 280 " +
      "C 885 320, 880 360, 870 385 C 850 415, 790 430, 750 432 " +
      "C 700 430, 650 420, 615 405 C 590 385, 580 350, 580 320 " +
      "C 580 290, 585 250, 600 230 Z",
    label: "INVENTORY",
    findings: ["2 writers", "shared w/ Ship"],
    cx: 735,
    cy: 320,
  },
  {
    // CONSIGNEE — small, clean, isolated, green oval bottom-left
    id: "consignee",
    status: "green",
    pathD:
      "M 60 460 C 75 435, 100 422, 130 420 C 165 418, 200 425, 215 445 " +
      "C 230 465, 230 490, 215 510 C 195 530, 160 535, 130 532 " +
      "C 100 530, 75 520, 60 505 C 50 490, 50 475, 60 460 Z",
    label: "CONSIGNEE",
    findings: ["clean ✓", "89% solo"],
    cx: 140,
    cy: 478,
  },
  {
    // INVOICING — amber, moderate-sized oval, bottom-center-left
    id: "invoicing",
    status: "amber",
    pathD:
      "M 280 440 C 305 422, 340 415, 380 418 C 425 422, 460 432, 475 455 " +
      "C 485 480, 480 510, 460 525 C 430 540, 390 545, 360 542 " +
      "C 320 538, 285 525, 270 505 C 260 485, 265 458, 280 440 Z",
    label: "INVOICING",
    findings: ["41% co-change"],
    cx: 370,
    cy: 480,
  },
  {
    // RETURNS/POLICY — purple, NEW, slightly amorphous, lower-middle
    id: "returns-policy",
    status: "purple",
    pathD:
      "M 530 480 C 555 462, 590 455, 625 460 C 665 466, 700 482, 712 510 " +
      "C 718 540, 705 568, 680 580 C 645 592, 605 595, 570 590 " +
      "C 535 583, 510 565, 505 540 C 503 515, 512 495, 530 480 Z",
    label: "RETURNS",
    sublabel: "/ POLICY",
    findings: ["NEW · from G", "DEL-E011"],
    cx: 608,
    cy: 525,
  },
  {
    // TRACKING — gray, small elongated horizontal shape, far right
    id: "tracking",
    status: "gray",
    pathD:
      "M 880 480 C 905 462, 945 455, 985 458 C 1025 462, 1055 472, 1062 495 " +
      "C 1065 515, 1055 532, 1030 540 C 990 548, 945 545, 910 538 " +
      "C 885 530, 870 510, 870 498 C 870 488, 875 482, 880 480 Z",
    label: "TRACKING",
    findings: ["silent participant"],
    cx: 968,
    cy: 502,
  },
  {
    // ??? bottom-left, dashed fuzzy
    id: "unknown-left",
    status: "unknown",
    pathD:
      "M 50 600 C 70 588, 105 583, 138 588 C 168 593, 195 605, 200 620 " +
      "C 203 638, 188 650, 165 652 C 130 656, 95 648, 72 638 " +
      "C 55 630, 48 618, 50 608 C 48 602, 48 600, 50 600 Z",
    label: "???",
    cx: 125,
    cy: 622,
  },
  {
    // ??? bottom-right, dashed fuzzy
    id: "unknown-right",
    status: "unknown",
    pathD:
      "M 870 600 C 895 588, 935 583, 970 588 C 1010 593, 1045 605, 1055 620 " +
      "C 1062 638, 1045 652, 1015 654 C 980 656, 940 648, 910 638 " +
      "C 885 630, 870 618, 870 608 C 870 602, 870 600, 870 600 Z",
    label: "???",
    cx: 965,
    cy: 622,
  },
];

const STATUS_CLASS: Record<Status, string> = {
  red: "statusRed",
  amber: "statusAmber",
  green: "statusGreen",
  purple: "statusPurple",
  gray: "statusGray",
  unknown: "statusUnknown",
};

export function BoundedContextMap() {
  // Background regions drawn first so smaller regions sit on top
  const bg = REGIONS.filter((r) => r.background);
  const fg = REGIONS.filter((r) => !r.background);
  const allInDrawOrder = [...bg, ...fg];

  return (
    <figure className={styles.figure}>
      <div className={styles.canvas}>
        <svg
          viewBox="0 0 1100 700"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* All region fills/strokes first */}
          {allInDrawOrder.map((r) => (
            <g key={`shape-${r.id}`} className={styles[STATUS_CLASS[r.status]]}>
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

          {/* Labels on top */}
          {allInDrawOrder.map((r) => {
            const subOffset = r.sublabel ? 18 : 0;
            const findingsStart = r.cy + subOffset + 22;
            return (
              <g key={`label-${r.id}`} className={styles[STATUS_CLASS[r.status]]}>
                <text
                  x={r.cx}
                  y={r.cy}
                  className={styles.regionLabel}
                  textAnchor="middle"
                >
                  {r.label}
                </text>
                {r.sublabel && (
                  <text
                    x={r.cx}
                    y={r.cy + 18}
                    className={styles.regionSublabel}
                    textAnchor="middle"
                  >
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

          {/* Explicit ghost-of-Shipment and ghost-of-Carrier labels inside the
              merged blob so the audience sees what fused. Struck-through to
              communicate "these were separate; not anymore." */}
          <g className={styles.statusRed}>
            <text x={290} y={155} className={styles.mergedGhostLabel} textAnchor="middle">
              <tspan className={styles.mergedStrike}>Shipment</tspan>
            </text>
            <text x={590} y={155} className={styles.mergedGhostLabel} textAnchor="middle">
              <tspan className={styles.mergedStrike}>Carrier</tspan>
            </text>
          </g>
        </svg>
      </div>

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

      <figcaption className={styles.caption}>
        Hypothesis v0.8 — Eight lenses. One evidence-backed hypothesis.
      </figcaption>
    </figure>
  );
}
