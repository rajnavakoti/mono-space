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

  return (
    <div className={styles.compareTable}>
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
