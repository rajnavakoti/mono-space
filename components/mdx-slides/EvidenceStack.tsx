/**
 * <EvidenceStack
 *    exhibits="A · Contracts|B · Database|C · Transactions"
 *    rows="Pair-1::cell-A|cell-B|cell-C||Pair-2::cell-A|cell-B|cell-C"
 *    caption="…"
 * />
 *
 * Compact grid that shows how a finding accumulates across exhibits.
 * Each row is a service-pair (or any other tracked finding). Each
 * column is one exhibit lens. Each cell carries a marker + short
 * detail:
 *
 *   "—"   or empty   = no signal yet
 *   "⚠ text"          = hypothesis / warning (amber tint)
 *   "✗ text"          = confirmed at this lens (red tint)
 *   "✗✗ text"         = proved / undeniable (deep red tint, bold)
 *
 * Designed for "each exhibit confirms the previous" moments — slides
 * where the talk needs to say "this isn't a new finding, it's been
 * there since Exhibit A and every lens since has hardened it."
 *
 * Row format: rows are separated by `||`. Inside a row, the label
 * and the cells are separated by `::`, and cells are separated by
 * `|`.
 */
import React from "react";
import styles from "./EvidenceStack.module.css";

interface EvidenceStackProps {
  /** Pipe-separated exhibit column headers (e.g., "A · Contracts|B · Database|C · Transactions"). */
  exhibits: string;
  /**
   * Double-pipe-separated rows. Each row is `label::cell|cell|cell`.
   * Cells use leading-marker convention: "⚠…" / "✗…" / "✗✗…" / "—".
   */
  rows: string;
  /** Optional caption rendered below the grid. */
  caption?: string;
}

type Severity = "none" | "warn" | "red" | "strong";

interface Cell {
  marker: string;
  text: string;
  severity: Severity;
}

function parseCell(raw: string): Cell {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "—" || trimmed === "-") {
    return { marker: "—", text: "", severity: "none" };
  }
  if (trimmed.startsWith("✗✗")) {
    return {
      marker: "✗✗",
      text: trimmed.slice(2).trim(),
      severity: "strong",
    };
  }
  if (trimmed.startsWith("✗")) {
    return { marker: "✗", text: trimmed.slice(1).trim(), severity: "red" };
  }
  if (trimmed.startsWith("⚠")) {
    return { marker: "⚠", text: trimmed.slice(1).trim(), severity: "warn" };
  }
  // No recognised marker — treat as neutral.
  return { marker: "", text: trimmed, severity: "none" };
}

const SEVERITY_CLASS: Record<Severity, string> = {
  none: "cellNone",
  warn: "cellWarn",
  red: "cellRed",
  strong: "cellStrong",
};

export function EvidenceStack({
  exhibits,
  rows,
  caption,
}: EvidenceStackProps) {
  const exhibitList = exhibits.split("|").map((e) => e.trim());
  const rowList = rows.split("||").map((raw) => {
    const [label, cellsRaw] = raw.split("::").map((s) => s.trim());
    const cells = (cellsRaw ?? "").split("|").map(parseCell);
    return { label: label ?? "", cells };
  });

  // Inline grid columns: a row-label column + one 1fr column per exhibit.
  const gridStyle = {
    gridTemplateColumns: `220px repeat(${exhibitList.length}, 1fr)`,
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.grid} style={gridStyle}>
        {/* Header row: empty corner + exhibit labels. */}
        <div className={styles.cornerCell} />
        {exhibitList.map((label, i) => (
          <div key={i} className={styles.exhibitHeader}>
            {label}
          </div>
        ))}

        {/* Data rows. */}
        {rowList.map((row, ri) => (
          <React.Fragment key={ri}>
            <div className={styles.rowLabel}>{row.label}</div>
            {row.cells.map((cell, ci) => (
              <div
                key={ci}
                className={`${styles.cell} ${styles[SEVERITY_CLASS[cell.severity]]}`}
              >
                {cell.marker && (
                  <span className={styles.cellMarker}>{cell.marker}</span>
                )}
                {cell.text && (
                  <span className={styles.cellText}>{cell.text}</span>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {caption && <div className={styles.caption}>{caption}</div>}
    </figure>
  );
}
