import { render, screen } from "@testing-library/react";
import { BoundedContextMap } from "./BoundedContextMap";

describe("BoundedContextMap", () => {
  it("at v0 renders 6 small named contexts + 2 labelled unknown blobs, no findings", () => {
    render(<BoundedContextMap version="0" />);
    for (const n of ["Shipment", "Carrier", "Consignee", "Inventory", "Invoicing", "Tracking"]) {
      expect(screen.getByText(n)).toBeInTheDocument();
    }
    // The two unknown blobs now carry descriptive labels instead of '???'.
    expect(screen.getByText("Carrier Routing")).toBeInTheDocument();
    expect(screen.getByText("· Customs · Returns")).toBeInTheDocument();
    expect(screen.getByText("External Systems")).toBeInTheDocument();
    expect(screen.queryByText("⚠ god entity")).not.toBeInTheDocument();
  });

  it("at v1 shows Exhibit A hypotheses — god entity, 0 events + published language?, circular, generic subdomain?", () => {
    render(<BoundedContextMap version="1" />);
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText("published language?")).toBeInTheDocument();
    expect(screen.getByText("↔ circular")).toBeInTheDocument();
    expect(screen.getByText("generic subdomain?")).toBeInTheDocument();
  });

  it("at v2 Exhibit B findings — facade, disputed aggregate, struck-through published language?", () => {
    render(<BoundedContextMap version="2" />);
    expect(screen.getByText("2 writers")).toBeInTheDocument();
    expect(screen.getByText("disputed aggregate?")).toBeInTheDocument();
    expect(screen.getByText("facade")).toBeInTheDocument();
    // 'published language?' is rendered with strike-through styling
    // (the ~~markers~~ are stripped before render).
    const stricken = screen.getByText("published language?");
    expect(stricken).toBeInTheDocument();
    expect(stricken.getAttribute("class")).toMatch(/regionFindingStrike/);
  });

  it("at v3 Exhibit C findings — aggregates + extractable + BLOCKED verdicts", () => {
    render(<BoundedContextMap version="3" />);
    // Four aggregates surfaced by C's transaction clustering — each
    // named as the first finding line on the owning context.
    expect(screen.getByText("Order Aggregate")).toBeInTheDocument();
    expect(screen.getByText("Delivery Aggregate")).toBeInTheDocument();
    expect(screen.getByText("Payment Aggregate")).toBeInTheDocument();
    expect(screen.getByText("Reservation Aggregate")).toBeInTheDocument();
    // 'extractable ✓' appears on BOTH Carrier and Consignee.
    expect(screen.getAllByText("extractable ✓").length).toBeGreaterThanOrEqual(2);
    // BLOCKED ✗ appears on Shipment AND Inventory.
    expect(screen.getAllByText("BLOCKED ✗").length).toBeGreaterThanOrEqual(2);
  });

  it("at v5 Consignee flips to clean ✓ (tech-debt '0 incidents' lives in legend, not circle)", () => {
    render(<BoundedContextMap version="5" />);
    expect(screen.getByText("clean ✓")).toBeInTheDocument();
    // '0 incidents' is a tech-debt metric — should NOT appear inside
    // the Consignee circle.
    expect(screen.queryByText("0 incidents")).not.toBeInTheDocument();
  });

  it("at v6 Returns/Policy reveals — tech-debt counts ('891 overrides') stripped", () => {
    render(<BoundedContextMap version="6" />);
    expect(screen.getByText("RETURNS")).toBeInTheDocument();
    expect(screen.getAllByText("DEL-E011").length).toBeGreaterThanOrEqual(1);
    // '⚠ 891 overrides' is a tech-debt count — should NOT appear inside
    // a circle. The escape-hatch rule itself stays in the speaker notes
    // + the error-code slides.
    expect(screen.queryByText("⚠ 891 overrides")).not.toBeInTheDocument();
  });

  it("at v7 Shipment + Carrier merge into Shipment Fulfilment blob with summary band (was v8)", () => {
    render(<BoundedContextMap version="7" />);
    expect(screen.getByText("SHIPMENT FULFILMENT")).toBeInTheDocument();
    expect(screen.getByText(/Shipment ⊕ Carrier/)).toBeInTheDocument();
    expect(screen.getByText("Remembered")).toBeInTheDocument();
    expect(screen.getByText("Discovered")).toBeInTheDocument();
  });
});
