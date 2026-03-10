import Link from "next/link";
import { getAllPresentations } from "@/lib/presentations";
import styles from "./page.module.css";

export const metadata = {
  title: "Presentations",
  description: "Conference talks and presentations on architecture, DDD, and AI.",
};

export default function PresentationsPage() {
  const presentations = getAllPresentations();

  return (
    <div className={styles.page}>
      <div className={styles.window}>
        <div className={styles.windowBar}>
          <span className={styles.windowLabel}>TALKS/</span>
          <span className={styles.windowMeta}>
            {presentations.length} {presentations.length === 1 ? "talk" : "talks"}
          </span>
        </div>
        <div className={styles.windowBody}>
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
                      <div className={styles.cardBar}>
                        <span className={styles.event}>{pres.event}</span>
                        <div className={styles.cardMeta}>
                          <time className={styles.date}>{pres.date}</time>
                          <span className={styles.separator} aria-hidden="true">|</span>
                          <span className={styles.slides}>
                            {pres.slideCount} slides
                          </span>
                        </div>
                      </div>
                      <div className={styles.cardBody}>
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
      </div>
    </div>
  );
}
