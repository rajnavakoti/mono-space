import styles from "./MdxSlides.module.css";

interface CompareTableProps {
  headers: string;
  rows: string;
}

export function CompareTable({ headers, rows }: CompareTableProps) {
  const cols = headers.split("|").map((s) => s.trim());
  const rowData = rows.split("||").map((row) =>
    row.split("|").map((cell) => cell.trim())
  );

  // Column count drives the grid template. The MdxSlides.module.css default
  // is 2 columns; this inline override keeps any column count working.
  const gridStyle = { gridTemplateColumns: `repeat(${cols.length}, 1fr)` };

  // The base CSS caps max-width at 700px (great for 2-3 col tables, clips
  // anything wider). Allow ~140px per column past that cap so 5/7/9-col
  // tables breathe without sacrificing the compact feel of narrow ones.
  const minTableWidth = Math.max(700, cols.length * 140);
  const tableStyle = { maxWidth: `${minTableWidth}px` };

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
            <div key={j} className={styles.compareTableCell}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
