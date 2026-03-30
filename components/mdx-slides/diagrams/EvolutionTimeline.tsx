"use client";

import styles from "./Diagrams.module.css";

interface TimelineNode {
  year: string;
  title: string;
  subtitle: string;
  highlight?: boolean;
  badge?: string;
}

interface EvolutionTimelineProps {
  nodes: TimelineNode[];
}

export function EvolutionTimeline({ nodes = [] }: EvolutionTimelineProps) {
  return (
    <div className={styles.timeline}>
      {nodes.map((node, i) => (
        <div
          key={node.year}
          className={`${styles.timelineNode} ${node.highlight ? styles.timelineNodeHighlight : ""}`}
        >
          <div className={styles.timelineYear}>{node.year}</div>
          <div className={styles.timelineLine}>
            <div className={styles.timelineDot} />
            {i < nodes.length - 1 && <div className={styles.timelineConnector} />}
          </div>
          <div className={styles.timelineContent}>
            <div className={styles.timelineTitle}>{node.title}</div>
            <div className={styles.timelineSubtitle}>{node.subtitle}</div>
            {node.badge && (
              <div className={styles.timelineBadge}>{node.badge}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
