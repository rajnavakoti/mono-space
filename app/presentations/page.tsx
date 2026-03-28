import Link from "next/link";
import { getAllPresentations } from "@/lib/presentations";
import { PlaceholderCover } from "@/components/PlaceholderCover";
import styles from "./page.module.css";

export const metadata = {
  title: "Presentations",
  description: "Conference talks and presentations on architecture, DDD, and AI.",
};

export default function PresentationsPage() {
  const presentations = getAllPresentations();

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>TALKS/</span>
        <span className={styles.sectionMeta}>
          {presentations.length} {presentations.length === 1 ? "talk" : "talks"}
        </span>
      </div>
      {presentations.length === 0 ? (
        <p className={styles.empty}>// no presentations yet</p>
      ) : (
        <ul className={styles.list}>
          {presentations.map((pres) => (
            <li key={pres.slug}>
              <Link
                href={`/presentations/${pres.slug}`}
                className={styles.cardLink}
              >
                <article className={styles.card}>
                  <PlaceholderCover title={pres.title} />
                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span className={styles.event}>{pres.event}</span>
                      <span className={styles.separator} aria-hidden="true">|</span>
                      <time className={styles.date}>{pres.date}</time>
                      <span className={styles.separator} aria-hidden="true">|</span>
                      <span className={styles.slides}>
                        {pres.slideCount} slides
                      </span>
                      {pres.format === "mdx" && (
                        <>
                          <span className={styles.separator} aria-hidden="true">|</span>
                          <span className={styles.formatBadge}>INTERACTIVE</span>
                        </>
                      )}
                    </div>
                    <h2 className={styles.cardTitle}>{pres.title}</h2>
                    <p className={styles.description}>{pres.description}</p>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
