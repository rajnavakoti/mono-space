/**
 * <ContradictionReveal />
 *
 * Cross-exhibit refutation visual. Renders as a single unified panel that
 * conveys "earlier exhibit said X / later exhibit reveals Y / here's the
 * punchline." Replaces the two-Callouts-plus-orphan-blockquote pattern.
 *
 * Designed to recur across the deck whenever a later exhibit refutes,
 * revises, or extends a finding from an earlier one — B refutes A here,
 * but the same shape works for C-vs-B, E-traces-to-A/B/C/D, H-overrules-C
 * down the line.
 *
 * Structure: top = earlier claim (struck through via CSS), connector band
 * with optional amber label, bottom = later finding, optional punchline
 * footer with a top accent border.
 *
 * Statement separator: "|" so it parses nicely from MDX prop strings.
 */
import styles from "./ContradictionReveal.module.css";

interface ContradictionRevealProps {
  /** The earlier exhibit's name, e.g. "Exhibit A" */
  earlierExhibit: string;
  /** Pipe-separated statements from the earlier exhibit (these get struck through) */
  earlierClaim: string;
  /** The later exhibit's name, e.g. "Exhibit B" */
  laterExhibit: string;
  /** Pipe-separated statements from the later exhibit (the active finding) */
  laterFinding: string;
  /** Optional bottom punchline, integrated into the panel so it never orphans.
   *  Use "|" to split into paragraphs for dramatic line breaks. */
  punchline?: string;
  /** Label shown in the connector band. Defaults to "but the database says…" feel. */
  connector?: string;
}

export function ContradictionReveal({
  earlierExhibit,
  earlierClaim,
  laterExhibit,
  laterFinding,
  punchline,
  connector = "but…",
}: ContradictionRevealProps) {
  const earlierStatements = earlierClaim.split("|").map((s) => s.trim()).filter(Boolean);
  const laterStatements = laterFinding.split("|").map((s) => s.trim()).filter(Boolean);

  return (
    <div className={styles.container}>
      <section className={styles.earlier}>
        <div className={styles.label}>{`// ${earlierExhibit.toLowerCase()} said`}</div>
        <ul className={styles.statements}>
          {earlierStatements.map((s, i) => (
            <li key={i} className={styles.earlierStatement}>{s}</li>
          ))}
        </ul>
      </section>

      <div className={styles.connector}>
        <span className={styles.connectorArrow}>↓</span>
        <span className={styles.connectorLabel}>{connector}</span>
      </div>

      <section className={styles.later}>
        <div className={styles.label}>{`// ${laterExhibit.toLowerCase()} reveals`}</div>
        <ul className={styles.statements}>
          {laterStatements.map((s, i) => (
            <li key={i} className={styles.laterStatement}>{s}</li>
          ))}
        </ul>
      </section>

      {punchline && (
        <footer className={styles.punchline}>
          {punchline.split("|").map((para, i, arr) => (
            <p key={i} className={styles.punchlinePara}>
              {`${i === 0 ? "“" : ""}${para.trim()}${i === arr.length - 1 ? "”" : ""}`}
            </p>
          ))}
        </footer>
      )}
    </div>
  );
}
