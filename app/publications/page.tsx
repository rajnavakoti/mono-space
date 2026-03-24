import styles from "./page.module.css";

export const metadata = {
  title: "Publications",
  description: "Academic publications and pre-prints.",
};

interface Publication {
  title: string;
  authors: string;
  venue: string;
  date: string;
  type: "pre-print" | "journal" | "conference";
  url: string;
  abstract: string;
}

const publications: Publication[] = [
  {
    title:
      "Demand-Driven Context: A Methodology for Building Enterprise Knowledge Bases Through Agent Failure",
    authors: "Raj Navakoti, Saideep Navakoti",
    venue: "arXiv",
    date: "2026-03",
    type: "pre-print",
    url: "https://arxiv.org/abs/2603.14057",
    abstract:
      "A methodology that uses AI agent failures as signals to identify what domain knowledge enterprises need to curate. Rather than pre-engineering knowledge bases, the approach lets agents encounter real problems and demands only the minimum knowledge required for success — inspired by test-driven development principles.",
  },
];

export default function PublicationsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>PUBLICATIONS/</span>
        <span className={styles.sectionMeta}>
          {publications.length} {publications.length === 1 ? "paper" : "papers"}
        </span>
      </div>

      <ul className={styles.list}>
        {publications.map((pub) => (
          <li key={pub.url}>
            <a
              href={pub.url}
              className={styles.cardLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <article className={styles.card}>
                <div className={styles.cardMeta}>
                  <span className={styles.typeBadge}>{pub.type}</span>
                  <span className={styles.venue}>{pub.venue}</span>
                  <span className={styles.separator} aria-hidden="true">|</span>
                  <time className={styles.date}>{pub.date}</time>
                </div>
                <h2 className={styles.cardTitle}>
                  {pub.title}
                  <span className={styles.arrow}> &rarr;</span>
                </h2>
                <p className={styles.authors}>{pub.authors}</p>
                <p className={styles.abstract}>{pub.abstract}</p>
              </article>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
