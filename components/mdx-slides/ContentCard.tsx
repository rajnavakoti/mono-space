import styles from "./MdxSlides.module.css";

interface ContentCardProps {
  title: string;
  items: string;
  accent?: "amber" | "red" | "green" | "blue" | "default";
}

const accentClassMap: Record<string, string> = {
  amber: styles.contentCardAmber,
  red: styles.contentCardRed,
  green: styles.contentCardGreen,
  blue: styles.contentCardBlue,
  default: "",
};

export function ContentCard({ title, items, accent = "default" }: ContentCardProps) {
  const itemList = items.split(",").map((s) => s.trim());
  const accentClass = accentClassMap[accent] || "";

  return (
    <div className={`${styles.contentCard} ${accentClass}`}>
      <div className={styles.contentCardHeader}>
        <div className={styles.contentCardDots} aria-hidden="true">
          <span className={styles.contentCardDot} />
          <span className={styles.contentCardDot} />
          <span className={styles.contentCardDot} />
        </div>
        <span className={styles.contentCardTitle}>{title}</span>
      </div>
      <div className={styles.contentCardBody}>
        {itemList.map((item) => (
          <div key={item} className={styles.contentCardItem}>{item}</div>
        ))}
      </div>
    </div>
  );
}
