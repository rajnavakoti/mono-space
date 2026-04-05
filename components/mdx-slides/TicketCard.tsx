import styles from "./MdxSlides.module.css";

interface TicketCardProps {
  id: string;
  type: string;
  title: string;
  items: string;
}

const typeColors: Record<string, string> = {
  story: "#5A8AB5",
  incident: "#B55A5A",
  task: "#B5955A",
  bug: "#B55A5A",
};

const itemColorMap: Record<string, string> = {
  g: "#5AB55A",
  o: "#B5955A",
  r: "#B55A5A",
};

export function TicketCard({ id, type, title, items }: TicketCardProps) {
  const borderColor = typeColors[type.toLowerCase()] || "var(--color-border)";
  const parsedItems = items.split("|").map((entry) => {
    const trimmed = entry.trim();
    const colorCode = trimmed.charAt(0);
    const text = trimmed.slice(2).trim();
    const color = itemColorMap[colorCode] || "var(--color-text-secondary)";
    return { text, color };
  });

  return (
    <div className={styles.ticketCard} style={{ borderLeftColor: borderColor }}>
      <div className={styles.ticketCardHeader}>
        <span className={styles.ticketCardId}>{id}</span>
        <span className={styles.ticketCardType}>{type}</span>
      </div>
      <div className={styles.ticketCardTitle}>{title}</div>
      <div className={styles.ticketCardItems}>
        {parsedItems.map((item, i) => (
          <div key={i} className={styles.ticketCardItem}>
            <span className={styles.ticketCardDot} style={{ backgroundColor: item.color }} />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
