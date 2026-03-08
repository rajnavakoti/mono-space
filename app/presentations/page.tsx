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
      <header className={styles.header}>
        <h1 className={styles.title}>// presentations</h1>
        <p className={styles.subtitle}>
          Conference talks and presentations.
        </p>
      </header>

      {presentations.length === 0 ? (
        <p className={styles.empty}>No presentations yet.</p>
      ) : (
        <ul className={styles.list}>
          {presentations.map((pres) => (
            <li key={pres.slug}>
              <Link
                href={`/presentations/${pres.slug}`}
                className={styles.cardLink}
              >
                <article className={styles.card}>
                  <div className={styles.meta}>
                    <span className={styles.event}>{pres.event}</span>
                    <time className={styles.date}>{pres.date}</time>
                    <span className={styles.slides}>
                      {pres.slideCount} slides
                    </span>
                  </div>
                  <h2 className={styles.cardTitle}>{pres.title}</h2>
                  <p className={styles.description}>{pres.description}</p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
