import { render, screen } from "@testing-library/react";
import { BoundedContextMap } from "./BoundedContextMap";

describe("BoundedContextMap", () => {
  it("renders all 6 named contexts + Returns/Policy + 2 unknowns", () => {
    render(<BoundedContextMap />);

    expect(screen.getByText("SHIPMENT FULFILMENT")).toBeInTheDocument();
    expect(screen.getByText("INVENTORY")).toBeInTheDocument();
    expect(screen.getByText("CONSIGNEE")).toBeInTheDocument();
    expect(screen.getByText("INVOICING")).toBeInTheDocument();
    expect(screen.getByText("RETURNS")).toBeInTheDocument();
    expect(screen.getByText("TRACKING")).toBeInTheDocument();
    expect(screen.getAllByText("???")).toHaveLength(2);
  });

  it("renders the merge subtitle and god-entity finding inside the merged blob", () => {
    render(<BoundedContextMap />);
    expect(screen.getByText(/Shipment ⊕ Carrier/)).toBeInTheDocument();
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
  });

  it("shows the ghost-of-formerly-separate Shipment and Carrier labels inside the merged blob", () => {
    render(<BoundedContextMap />);
    // 'Shipment' appears inside the SHIPMENT FULFILMENT main label too,
    // but the ghost labels render as standalone tspans.
    expect(screen.getByText("Shipment")).toBeInTheDocument();
    expect(screen.getByText("Carrier")).toBeInTheDocument();
  });

  it("renders the Remembered 3 / Discovered 7 summary band", () => {
    render(<BoundedContextMap />);
    expect(screen.getByText("Remembered")).toBeInTheDocument();
    expect(screen.getByText("Discovered")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
