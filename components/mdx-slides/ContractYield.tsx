/**
 * <ContractYield /> — sidebar panel that lists what the contracts yielded.
 *
 * Designed to sit beside the existing inventory CompareTable on slide 19
 * (Exhibit A). Two sections:
 *
 *   1. Entities by service — compact "Service: a, b, c" lines
 *   2. Domain events strip  — sticky-note chips, "never published" footnote
 *
 * No tables, no math pills, no heavy column blocks — that was the previous
 * over-engineered take. This is the lightweight version that augments the
 * existing table instead of replacing it.
 *
 * All slide content has props with sensible Exhibit-A defaults baked in
 * because next-mdx-remote/rsc + remark doesn't reliably parse multi-line
 * array-of-object JSX expression props.
 */
import type { CSSProperties } from "react";
import styles from "./ContractYield.module.css";

export interface ContractYieldService {
  name: string;
  entities: string[];
}

export interface ContractYieldProps {
  services?: ContractYieldService[];
  domainEvents?: string[];
}

const EXHIBIT_A_DEFAULTS: Required<ContractYieldProps> = {
  services: [
    {
      name: "Shipment",
      entities: ["Order", "OrderLine", "Address", "ShipmentInfo", "Invoice (copy)"],
    },
    {
      name: "Carrier",
      entities: ["Shipment", "DeliveryAddress", "TrackingEvent", "Carrier", "RateQuote"],
    },
    {
      name: "Consignee",
      entities: ["Customer", "CustomerAddress", "CustomerPreferences", "LoyaltyInfo"],
    },
    {
      name: "Invoicing",
      entities: [
        "Invoice",
        "InvoiceLineItem",
        "Payment",
        "Refund",
        "AccountBalance",
        "BillingAddress",
      ],
    },
    {
      name: "Inventory",
      entities: ["Warehouse", "WarehouseLocation", "StockLevel", "Product", "Reservation"],
    },
    {
      name: "Tracking",
      entities: ["Notification", "Template", "UserNotificationPreferences"],
    },
  ],
  domainEvents: [
    "OrderPlaced",
    "OrderConfirmed",
    "OrderCancelled",
    "OrderLineAdded",
    "FulfillmentStarted",
    "OrderCompleted",
    "ShipmentCreated",
    "ShipmentPickedUp",
    "ShipmentInTransit",
    "ShipmentOutForDelivery",
    "ShipmentDelivered",
    "ShipmentFailed",
    "ShipmentReturned",
  ],
};

export function ContractYield({
  services = EXHIBIT_A_DEFAULTS.services,
  domainEvents = EXHIBIT_A_DEFAULTS.domainEvents,
}: ContractYieldProps = {}) {
  const totalEntities = services.reduce((n, s) => n + s.entities.length, 0);

  return (
    <figure className={styles.figure}>
      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionCount}>{totalEntities}</span>
          <span className={styles.sectionLabel}>entities · extracted from contracts</span>
        </header>
        <ul className={styles.serviceList}>
          {services.map((s) => (
            <li key={s.name} className={styles.serviceLine}>
              <span className={styles.serviceName}>{s.name}</span>
              <span className={styles.serviceEntities}>{s.entities.join(", ")}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <header className={styles.sectionHeader}>
          <span className={styles.sectionCount}>{domainEvents.length}</span>
          <span className={styles.sectionLabel}>
            domain events · <em>never published</em>
          </span>
        </header>
        <ul className={styles.eventChips}>
          {domainEvents.map((e, i) => {
            const rot = (i % 2 === 0 ? -1 : 1) * (0.3 + (i % 3) * 0.3);
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
      </section>
    </figure>
  );
}
