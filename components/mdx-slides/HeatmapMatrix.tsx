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
}

export function HeatmapMatrix({
  labels,
  rowNames,
  cells,
  highlightRow,
  highlightCol,
}: HeatmapMatrixProps) {
  const cols = labels.split("|").map((s) => s.trim());
  const rows = (rowNames ?? labels).split("|").map((s) => s.trim());
  const matrix = cells.split("||").map((row) =>
    row.split("|").map((c) => c.trim()),
  );

  const rowHighlightIdx = highlightRow ? rows.indexOf(highlightRow) : -1;
  const colHighlightIdx = highlightCol ? cols.indexOf(highlightCol) : -1;

  // Inline grid columns: a fixed label column plus 1fr per data column.
  const gridStyle = {
    gridTemplateColumns: `120px repeat(${cols.length}, 1fr)`,
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
          </div>
        );
      })}
    </div>
  );
}
