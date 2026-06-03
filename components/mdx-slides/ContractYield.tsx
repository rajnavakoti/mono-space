/**
 * <ContractYield /> — Exhibit A's holistic view.
 *
 * Three stacked sections:
 *   1. Extraction math    — schemas → noise stripped → entities + events
 *   2. Service columns    — one per service, with extracted entities
 *   3. Domain events strip — sticky-note style chips (Event Storming convention)
 *
 * The punch: six contracts yield an Event-Storming starter pack — entities
 * plus domain events that are implicit in the contract state machines but
 * never published as events anywhere.
 *
 * All slide content arrives via props so the same component can render
 * any exhibit's "what-this-yielded" summary.
 */
import type { CSSProperties } from "react";
import styles from "./ContractYield.module.css";

export interface ContractYieldService {
  name: string;
  entities: string[];
  /** Small badge in the column header for anomalies (NONE events, stale). */
  flag?: { text: string; tone?: "warn" | "danger" };
}

export interface ContractYieldProps {
  /** Raw schema count in the contracts (before noise stripping). */
  totalSchemas: number;
  /** Schemas dropped as noise — req/resp wrappers, enums, summaries, paging. */
  noiseStripped: number;
  /** Service columns. The number of columns is derived from this array. */
  services: ContractYieldService[];
  /** Domain events extracted from contract state machines. */
  domainEvents: string[];
}

export function ContractYield({
  totalSchemas,
  noiseStripped,
  services,
  domainEvents,
}: ContractYieldProps) {
  const totalEntities = services.reduce((n, s) => n + s.entities.length, 0);

  return (
    <figure className={styles.figure}>
      <div className={styles.math}>
        <Pill n={totalSchemas} label="schemas" />
        <Op>strip noise</Op>
        <Pill n={`−${noiseStripped}`} label="dropped" tone="muted" />
        <Op>yields</Op>
        <Pill n={totalEntities} label="entities" tone="accent" />
        <Op>+</Op>
        <Pill n={domainEvents.length} label="events" tone="accent" />
      </div>

      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${services.length}, 1fr)` }}
      >
        {services.map((s) => (
          <ServiceColumn key={s.name} service={s} />
        ))}
      </div>

      <div className={styles.events}>
        <div className={styles.eventsHeader}>
          <span className={styles.eventsTitle}>
            {domainEvents.length} domain events
          </span>
          <span className={styles.eventsNote}>
            implicit in contract state machines · never published
          </span>
        </div>
        <ul className={styles.eventChips}>
          {domainEvents.map((e, i) => {
            // Subtle alternating rotation for hand-drawn sticky-note feel.
            const rot = (i % 2 === 0 ? -1 : 1) * (0.4 + (i % 3) * 0.35);
            return (
              <li
                key={e}
                className={styles.eventChip}
                style={{ "--rot": `${rot}deg` } as CSSProperties}
              >
                {e}
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}

function Pill({
  n,
  label,
  tone,
}: {
  n: string | number;
  label: string;
  tone?: "muted" | "accent";
}) {
  const cls = `${styles.pill} ${tone === "muted" ? styles.pillMuted : ""} ${
    tone === "accent" ? styles.pillAccent : ""
  }`;
  return (
    <div className={cls}>
      <div className={styles.pillN}>{n}</div>
      <div className={styles.pillLabel}>{label}</div>
    </div>
  );
}

function Op({ children }: { children: React.ReactNode }) {
  return <div className={styles.op}>{children}</div>;
}

function ServiceColumn({ service }: { service: ContractYieldService }) {
  const count = service.entities.length;
  return (
    <div className={styles.col}>
      <div className={styles.colHeader}>
        <div className={styles.colName}>{service.name}</div>
        <div className={styles.colCount}>
          {count} {count === 1 ? "entity" : "entities"}
        </div>
        {service.flag && (
          <div
            className={`${styles.colFlag} ${
              service.flag.tone === "danger" ? styles.flagDanger : ""
            } ${service.flag.tone === "warn" ? styles.flagWarn : ""}`}
          >
            {service.flag.text}
          </div>
        )}
      </div>
      <ul className={styles.entityList}>
        {service.entities.map((e) => (
          <li key={e} className={styles.entityItem}>
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}
