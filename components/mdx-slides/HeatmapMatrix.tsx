/**
 * <HeatmapMatrix />
 *
 * Compact N×N coupling/dependency matrix rendered as a heatmap.
 *
 * Designed as a diagram — not a table. Cells are colour-filled (not text-X)
 * so the visual pattern of clustering reads at a glance. Optional row/column
 * highlight tints a band across the matrix to mark the signals (e.g. "this
 * row is the god service," "this column is the bottleneck"), with the
 * intersection in a stronger shade.
 *
 * Cell markers (in `cells`):
 *   "-" = diagonal (self-reference)
 *   "x" = dependency / filled
 *   "." = empty
 *
 * Format: rows joined by "||", cells in a row joined by "|".
 */
import styles from "./HeatmapMatrix.module.css";

interface HeatmapMatrixProps {
  /** Pipe-separated short labels for columns (and rows if `rowNames` is omitted). */
  labels: string;
  /** Optional pipe-separated full names for rows. Defaults to `labels`. */
  rowNames?: string;
  /** Pipe-separated cells (rows joined by `||`, cells in a row by `|`). */
  cells: string;
  /** Row to highlight (must match an entry in `rowNames` or `labels`). */
  highlightRow?: string;
  /** Column to highlight (must match an entry in `labels`). */
  highlightCol?: string;
  /**
   * Optional pipe-separated text rendered as a right-most "Owns" column —
   * one entry per row, in row order. Used on the references-matrix slide
   * so each service's owned entities are visible alongside its references
   * pattern. Wrap a row's label in `**…**` to flag the standout row
   * (e.g. Tracking's "Notification + Template only" generic-subdomain
   * evidence) — that row's owns cell renders with a stronger tint.
   */
  ownsLabels?: string;
  /** Header text for the owns column. Defaults to "OWNS". */
  ownsHeader?: string;
}

export function HeatmapMatrix({
  labels,
  rowNames,
  cells,
  highlightRow,
  highlightCol,
  ownsLabels,
  ownsHeader = "OWNS",
}: HeatmapMatrixProps) {
  const cols = labels.split("|").map((s) => s.trim());
  const rows = (rowNames ?? labels).split("|").map((s) => s.trim());
  const matrix = cells.split("||").map((row) =>
    row.split("|").map((c) => c.trim()),
  );

  const rowHighlightIdx = highlightRow ? rows.indexOf(highlightRow) : -1;
  const colHighlightIdx = highlightCol ? cols.indexOf(highlightCol) : -1;

  // Optional "Owns" column. Each entry is a free-text label rendered
  // in the rightmost column. Wrapping a row's text in `**…**` flags it
  // as a standout row (stronger tint) — used for the Tracking row's
  // generic-subdomain evidence.
  const owns = ownsLabels
    ? ownsLabels.split("|").map((s) => s.trim())
    : null;
  const ownsCellFor = (idx: number): { text: string; standout: boolean } => {
    const raw = owns?.[idx] ?? "";
    const m = raw.match(/^\*\*(.+)\*\*$/);
    return m
      ? { text: m[1], standout: true }
      : { text: raw, standout: false };
  };

  // Inline grid columns: fixed label column + 1fr per data column + a
  // wider fixed column at the end for the optional Owns text.
  const gridStyle = {
    gridTemplateColumns: owns
      ? `120px repeat(${cols.length}, 1fr) 220px`
      : `120px repeat(${cols.length}, 1fr)`,
  };

  return (
    <div className={styles.heatmap}>
      {/* Column-header row */}
      <div className={styles.headerRow} style={gridStyle}>
        <div className={styles.cornerCell} />
        {cols.map((col, i) => (
          <div
            key={i}
            className={`${styles.colHeader} ${
              i === colHighlightIdx ? styles.colHeaderHighlight : ""
            }`}
          >
            {col}
          </div>
        ))}
        {owns && (
          <div className={`${styles.colHeader} ${styles.ownsHeader}`}>
            {ownsHeader}
          </div>
        )}
      </div>

      {/* Data rows */}
      {matrix.map((row, r) => {
        const rowHighlighted = r === rowHighlightIdx;
        return (
          <div key={r} className={styles.dataRow} style={gridStyle}>
            <div
              className={`${styles.rowHeader} ${
                rowHighlighted ? styles.rowHeaderHighlight : ""
              }`}
            >
              {rows[r]}
            </div>
            {row.map((cell, c) => {
              const colHighlighted = c === colHighlightIdx;
              const cellClasses = [
                styles.cell,
                cell === "x" ? styles.cellFilled : "",
                cell === "-" ? styles.cellDiagonal : "",
                rowHighlighted ? styles.cellInHighlightedRow : "",
                colHighlighted ? styles.cellInHighlightedCol : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={c} className={cellClasses}>
                  {cell === "x" && <span className={styles.markFilled}>✗</span>}
                  {cell === "-" && (
                    <span className={styles.markDiagonal}>—</span>
                  )}
                </div>
              );
            })}
            {owns && (() => {
              const { text, standout } = ownsCellFor(r);
              return (
                <div
                  className={`${styles.ownsCell} ${
                    standout ? styles.ownsCellStandout : ""
                  }`}
                >
                  {text}
                </div>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}
