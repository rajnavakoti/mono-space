import type { ReactNode } from "react";
import styles from "./MdxSlides.module.css";

interface TitleCardProps {
  children: ReactNode;
  badge?: string;
  subtitle?: string;
}

export function TitleCard({ children, badge, subtitle }: TitleCardProps) {
  return (
    <div className={styles.titleCardWrapper}>
      <div className={styles.titleCard}>
        {badge && <div className={styles.titleCardBadge}>{badge}</div>}
        <div className={styles.titleCardContent}>{children}</div>
        {subtitle && (
          <div className={styles.titleCardSubtitle}>{subtitle}</div>
        )}
      </div>
    </div>
  );
}
