import { render, screen } from "@testing-library/react";
import { BoundedContextMap } from "./BoundedContextMap";

describe("BoundedContextMap", () => {
  it("at v0 renders 6 small named contexts + 2 unknowns, no findings", () => {
    render(<BoundedContextMap version="0" />);
    for (const n of ["Shipment", "Carrier", "Consignee", "Inventory", "Invoicing", "Tracking"]) {
      expect(screen.getByText(n)).toBeInTheDocument();
    }
    expect(screen.getAllByText("???")).toHaveLength(2);
    expect(screen.queryByText("⚠ god entity")).not.toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.0/)).toBeInTheDocument();
  });

  it("at v1 shows Exhibit A findings — god entity, 0 events, circular, infra?", () => {
    render(<BoundedContextMap version="1" />);
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText("↔ circular")).toBeInTheDocument();
    expect(screen.getByText("infra?")).toBeInTheDocument();
  });

  it("at v2 Inventory turns red with '2 writers' and Consignee adds 'facade'", () => {
    render(<BoundedContextMap version="2" />);
    expect(screen.getByText("2 writers")).toBeInTheDocument();
    expect(screen.getByText("facade")).toBeInTheDocument();
  });

  it("at v3 Carrier gets READY and the BLOCKED label appears (Shipment + Inventory both)", () => {
    render(<BoundedContextMap version="3" />);
    expect(screen.getByText("READY ✓")).toBeInTheDocument();
    // BLOCKED ✗ deliberately appears on both Shipment and Inventory at v3+
    expect(screen.getAllByText("BLOCKED ✗").length).toBeGreaterThanOrEqual(1);
  });

  it("at v5 Consignee flips to clean ✓ with 0 incidents", () => {
    render(<BoundedContextMap version="5" />);
    expect(screen.getByText("clean ✓")).toBeInTheDocument();
    expect(screen.getByText("0 incidents")).toBeInTheDocument();
  });

  it("at v7 Returns/Policy reveals + shipment gains 891 overrides", () => {
    render(<BoundedContextMap version="7" />);
    expect(screen.getByText("RETURNS")).toBeInTheDocument();
    // DEL-E011 appears twice at v7: once as a Returns finding, once as the
    // returnsArrow overlay label. Both are intended.
    expect(screen.getAllByText("DEL-E011").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("⚠ 891 overrides").length).toBeGreaterThanOrEqual(1);
  });

  it("at v8 Shipment + Carrier merge into one Shipment Fulfilment blob with summary band", () => {
    render(<BoundedContextMap version="8" />);
    expect(screen.getByText("SHIPMENT FULFILMENT")).toBeInTheDocument();
    expect(screen.getByText(/Shipment ⊕ Carrier/)).toBeInTheDocument();
    expect(screen.getByText("Remembered")).toBeInTheDocument();
    expect(screen.getByText("Discovered")).toBeInTheDocument();
  });
});
