import { getAllWritings, getAllTags } from "@/lib/writings";
import { WritingsList } from "@/components/WritingsList";
import styles from "./page.module.css";

export const metadata = {
  title: "Writings",
  description: "Thoughts on DDD, architecture, AI, and software engineering.",
};

export default function WritingsPage() {
  const writings = getAllWritings();
  const allTags = getAllTags();

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>WRITINGS/</span>
        <span className={styles.sectionMeta}>
          {writings.length} {writings.length === 1 ? "piece" : "pieces"}
        </span>
      </div>
      <WritingsList writings={writings} allTags={allTags} />
    </div>
  );
}
