import { render, screen } from "@testing-library/react";
import { EventCatalog } from "./EventCatalog";

describe("EventCatalog", () => {
  it("at v1 renders the v0.1 title and subtitle", () => {
    render(<EventCatalog version="1" />);
    expect(screen.getByText("Event Catalog v0.1")).toBeInTheDocument();
    expect(
      screen.getByText("What services chose to announce"),
    ).toBeInTheDocument();
  });

  it("at v1 groups declared events by domain (Shipment 6 + Carrier 7)", () => {
    render(<EventCatalog version="1" />);
    expect(screen.getByText("Shipment Domain")).toBeInTheDocument();
    expect(screen.getByText("Carrier Domain")).toBeInTheDocument();
    // Counts render as '(6)' / '(7)' inside the domainCount span.
    expect(screen.getByText("(6)")).toBeInTheDocument();
    expect(screen.getByText("(7)")).toBeInTheDocument();
  });

  it("at v1 lists all 13 declared events", () => {
    render(<EventCatalog version="1" />);
    expect(screen.getByText("OrderPlaced")).toBeInTheDocument();
    expect(screen.getByText("OrderCompleted")).toBeInTheDocument();
    expect(screen.getByText("ShipmentCreated")).toBeInTheDocument();
    expect(screen.getByText("ShipmentReturned")).toBeInTheDocument();
  });

  it("at v1 lists the 4 silent services", () => {
    render(<EventCatalog version="1" />);
    expect(screen.getByText("Consignee")).toBeInTheDocument();
    expect(screen.getByText("Invoicing")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Tracking")).toBeInTheDocument();
  });

  it("at v1 renders the 13 declared / 4 silent counts", () => {
    render(<EventCatalog version="1" />);
    // '13' appears both as the standalone sectionCount and inside the
    // punchline ('13 declared.'). getAllByText handles both.
    expect(screen.getAllByText("13").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1);
  });

  it("falls back to v1 data when no version prop is passed", () => {
    render(<EventCatalog />);
    expect(screen.getByText("Event Catalog v0.1")).toBeInTheDocument();
    expect(screen.getByText("OrderPlaced")).toBeInTheDocument();
  });

  describe("at v2 (Exhibit C)", () => {
    it("renders the v0.2 title and subtitle", () => {
      render(<EventCatalog version="2" />);
      expect(screen.getByText("Event Catalog v0.2")).toBeInTheDocument();
      expect(
        screen.getByText("What the database tracks but never publishes"),
      ).toBeInTheDocument();
    });

    it("drops Invoicing from the silent list (DB surfaces 2 events for it)", () => {
      render(<EventCatalog version="2" />);
      expect(screen.queryByText("Invoicing")).not.toBeInTheDocument();
      // The other 3 remain silent at v0.2
      expect(screen.getByText("Consignee")).toBeInTheDocument();
      expect(screen.getByText("Inventory")).toBeInTheDocument();
      expect(screen.getByText("Tracking")).toBeInTheDocument();
    });

    it("renders the fossilized section with 6 events grouped by table", () => {
      render(<EventCatalog version="2" />);
      expect(
        screen.getByText(/new from Exhibit C/i),
      ).toBeInTheDocument();
      // OrderConfirmed / OrderCancelled appear BOTH in the declared list
      // (carried from v0.1) AND in the fossilized list — that's the
      // punch: 'we already declared this, the DB now proves it'.
      // The InvoicePaid / InvoiceIssued events are new at v0.2 (Invoicing
      // didn't declare them in v0.1).
      expect(screen.getAllByText("OrderConfirmed").length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("OrderShipped")).toBeInTheDocument();
      expect(screen.getByText("OrderDelivered")).toBeInTheDocument();
      expect(screen.getAllByText("OrderCancelled").length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("InvoicePaid")).toBeInTheDocument();
      expect(screen.getByText("InvoiceIssued")).toBeInTheDocument();
    });

    it("flags Invoicing events with the 'tracks internally' annotation", () => {
      render(<EventCatalog version="2" />);
      // Flag appears on both Invoicing events.
      expect(
        screen.getAllByText(/Invoicing declared 0 events/i).length,
      ).toBeGreaterThanOrEqual(2);
    });

    it("renders the 4 still-missing events footnote", () => {
      render(<EventCatalog version="2" />);
      expect(screen.getByText(/still have no evidence/i)).toBeInTheDocument();
      expect(
        screen.getByText(/ConsigneeRegistered.*AddressChanged.*LoyaltyTierUpgraded.*InventoryReserved/),
      ).toBeInTheDocument();
    });
  });

  describe("at v3 (Exhibit D — final)", () => {
    it("renders the v0.3 title and subtitle", () => {
      render(<EventCatalog version="3" />);
      expect(screen.getByText("Event Catalog v0.3 — Final")).toBeInTheDocument();
      expect(
        screen.getByText(
          /22 events.*9 the system never published.*3 that should exist but don't/i,
        ),
      ).toBeInTheDocument();
    });

    it("silent collapses to just Consignee", () => {
      render(<EventCatalog version="3" />);
      expect(screen.getByText("Consignee")).toBeInTheDocument();
      // Invoicing, Inventory, Tracking all have events surfaced somewhere
      expect(screen.queryByText("Invoicing")).not.toBeInTheDocument();
      // Inventory appears only as a domain in the declared list — wait,
      // no, declared = Shipment Domain / Carrier Domain only. So Inventory
      // shouldn't appear here at all at v3.
      expect(screen.queryByText("Inventory")).not.toBeInTheDocument();
      expect(screen.queryByText("Tracking")).not.toBeInTheDocument();
    });

    it("renders 9 fossilized events including the 3 new log-sourced ones", () => {
      render(<EventCatalog version="3" />);
      // 3 NEW from D logs
      expect(screen.getByText("InventoryReserved")).toBeInTheDocument();
      expect(screen.getByText("InvoiceGenerated")).toBeInTheDocument();
      expect(screen.getByText("RefundProcessed")).toBeInTheDocument();
      // daily-count sources for the log events
      expect(screen.getByText("11,891 / day")).toBeInTheDocument();
      expect(screen.getByText("156 / day")).toBeInTheDocument();
    });

    it("drops InventoryReserved from still-missing (logs surfaced it)", () => {
      render(<EventCatalog version="3" />);
      // Still-missing drops to 3 — InventoryReserved was found in logs
      expect(screen.getByText(/still have no evidence/i)).toBeInTheDocument();
      expect(
        screen.getByText(/ConsigneeRegistered.*AddressChanged.*LoyaltyTierUpgraded/),
      ).toBeInTheDocument();
      const missing = screen.getByText(/ConsigneeRegistered.*AddressChanged.*LoyaltyTierUpgraded/);
      expect(missing.textContent).not.toMatch(/InventoryReserved/);
    });
  });
});
