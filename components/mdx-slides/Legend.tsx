import styles from "./MdxSlides.module.css";

interface LegendProps {
  items: string;
}

export function Legend({ items }: LegendProps) {
  const parsed = items.split("|").map((entry) => {
    const parts = entry.trim().split("::");
    return { color: parts[0]?.trim() || "", label: parts[1]?.trim() || "" };
  });

  return (
    <div className={styles.legend}>
      {parsed.map((item) => (
        <div key={item.label} className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
