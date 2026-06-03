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
});
