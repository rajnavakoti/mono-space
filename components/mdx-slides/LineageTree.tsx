/**
 * <LineageTree />
 *
 * Two modes from one component:
 *   - With `source`: source-of-truth card on top + branch cards below with
 *     SVG lines diverging from source to each branch. Used to visualize
 *     "one origin, N derivations" — data lineage, schema fan-out.
 *   - Without `source`: just the branch row, no tree. Same card visual,
 *     used for "N peer contexts" comparison slides.
 *
 * branches format:
 *   "LABEL::icon::tagline::context::detail1·detail2 | ..."
 *
 * Each "·" splits a detail line. The context line is rendered as a small
 * uppercase chip at the bottom of the card.
 */
import styles from "./LineageTree.module.css";

interface Branch {
  label: string;
  icon: string;
  tagline: string;
  context: string;
  details: string[];
}

interface LineageTreeProps {
  /** Optional source card. Format: "LABEL::subtitle". Omit for card-row mode. */
  source?: string;
  /** Pipe-separated branches (see file header for format) */
  branches: string;
  /** Optional centered footer message under the cards (e.g. "342 MISMATCHES IN 90 DAYS") */
  footer?: string;
}

function parseSource(s: string): { label: string; subtitle?: string } {
  const [label, subtitle] = s.split("::").map((p) => p.trim());
  return { label, subtitle };
}

function parseBranches(input: string): Branch[] {
  return input.split("|").map((entry) => {
    const parts = entry.split("::").map((p) => p.trim());
    return {
      label: parts[0] || "",
      icon: parts[1] || "",
      tagline: parts[2] || "",
      context: parts[3] || "",
      details: (parts[4] || "")
        .split("·")
        .map((d) => d.trim())
        .filter(Boolean),
    };
  });
}

export function LineageTree({ source, branches, footer }: LineageTreeProps) {
  const branchList = parseBranches(branches);
  const src = source ? parseSource(source) : null;
  const n = branchList.length;

  return (
    <div className={styles.container}>
      {src && (
        <>
          <div className={styles.sourceRow}>
            <div className={styles.sourceCard}>
              <div className={styles.sourceLabel}>{src.label}</div>
              {src.subtitle && (
                <div className={styles.sourceSubtitle}>{src.subtitle}</div>
              )}
            </div>
          </div>
          <svg
            className={styles.connectors}
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {branchList.map((_, i) => {
              const xEnd = ((i + 0.5) / n) * 100;
              return (
                <line
                  key={i}
                  x1={50}
                  y1={0}
                  x2={xEnd}
                  y2={30}
                  stroke="var(--color-accent, #C9A96E)"
                  strokeWidth={0.4}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
        </>
      )}

      <div
        className={styles.branches}
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
      >
        {branchList.map((b, i) => (
          <div key={i} className={styles.branchCard}>
            {b.icon && <div className={styles.branchIcon}>{b.icon}</div>}
            <div className={styles.branchLabel}>{b.label}</div>
            {b.tagline && (
              <div className={styles.branchTagline}>{b.tagline}</div>
            )}
            {b.details.length > 0 && (
              <ul className={styles.branchDetails}>
                {b.details.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            )}
            {b.context && (
              <div className={styles.branchContext}>{b.context}</div>
            )}
          </div>
        ))}
      </div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
