import styles from "./PlaceholderCover.module.css";

type PatternType = "dots" | "lines" | "crosshatch" | "diagonal" | "grid";

interface PlaceholderCoverProps {
  title: string;
  pattern?: PatternType;
  className?: string;
}

const PATTERNS: PatternType[] = ["dots", "lines", "crosshatch", "diagonal", "grid"];

function patternFromTitle(title: string): PatternType {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) | 0;
  }
  return PATTERNS[Math.abs(hash) % PATTERNS.length];
}

export function PlaceholderCover({ title, pattern, className }: PlaceholderCoverProps) {
  const pat = pattern ?? patternFromTitle(title);

  return (
    <div
      className={`${styles.cover} ${styles[pat]} ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className={styles.overlay}>
        <span className={styles.icon}>&lt;/&gt;</span>
      </div>
    </div>
  );
}
