import type { ReactNode } from "react";
import styles from "./MdxSlides.module.css";

interface CompareTableProps {
  headers: string;
  rows: string;
  /**
   * Optional pipe-separated column weights (e.g. "1|1|1|1|3"). Defaults to
   * equal weights. Use this when the last column carries long-form narrative
   * text and the leading columns are short labels/IDs/numbers.
   */
  colWeights?: string;
  /**
   * Optional pipe-separated totals row, rendered at the bottom of the table
   * with a stronger top border and bold typography. Cells in this row also
   * support the same `**text**` highlight convention as regular rows.
   */
  totalsRow?: string;
}

/**
 * Parse a cell's text and render `**highlighted text**` segments with the
 * compareTableHighlight class (accent-tinted background, bold). Plain text
 * passes through untouched.
 */
function renderCellContent(text: string): ReactNode {
  if (!text.includes("**")) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <mark key={i} className={styles.compareTableHighlight}>
          {part.slice(2, -2)}
        </mark>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function CompareTable({
  headers,
  rows,
  colWeights,
  totalsRow,
}: CompareTableProps) {
  const cols = headers.split("|").map((s) => s.trim());
  const rowData = rows.split("||").map((row) =>
    row.split("|").map((cell) => cell.trim())
  );

  // Column widths: equal by default; pipe-separated weights let callers make
  // the narrative column wider than label/ID columns.
  const weights = colWeights
    ? colWeights.split("|").map((s) => s.trim())
    : cols.map(() => "1");
  const gridStyle = {
    gridTemplateColumns: weights.map((w) => `${w}fr`).join(" "),
  };

  // The base CSS caps max-width at 700px (great for narrow 2-3 col tables,
  // clips anything wider). Allow ~200px per column past that cap so 5/7/9-col
  // tables breathe without sacrificing the compact feel of narrow ones.
  const minTableWidth = Math.max(700, cols.length * 200);
  const tableStyle = { maxWidth: `${minTableWidth}px` };

  const totals = totalsRow
    ? totalsRow.split("|").map((cell) => cell.trim())
    : null;

  return (
    <div className={styles.compareTable} style={tableStyle}>
      <div className={styles.compareTableHeader} style={gridStyle}>
        {cols.map((col) => (
          <div key={col} className={styles.compareTableHeaderCell}>{col}</div>
        ))}
      </div>
      {rowData.map((row, i) => (
        <div key={i} className={styles.compareTableRow} style={gridStyle}>
          {row.map((cell, j) => (
            <div key={j} className={styles.compareTableCell}>
              {renderCellContent(cell)}
            </div>
          ))}
        </div>
      ))}
      {totals && (
        <div
          className={`${styles.compareTableRow} ${styles.compareTableTotalsRow}`}
          style={gridStyle}
        >
          {totals.map((cell, j) => (
            <div key={j} className={styles.compareTableCell}>
              {renderCellContent(cell)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
