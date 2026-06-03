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

  it("at v3 Exhibit C findings — Carrier + Consignee extractable, Shipment + Inventory BLOCKED", () => {
    render(<BoundedContextMap version="3" />);
    // 'extractable ✓' appears on BOTH Carrier (clean internal commits)
    // AND Consignee (clean internal commits, facade is a separate fix).
    expect(screen.getAllByText("extractable ✓").length).toBeGreaterThanOrEqual(2);
    // BLOCKED ✗ appears on Shipment AND Inventory (cross-context co-writes).
    expect(screen.getAllByText("BLOCKED ✗").length).toBeGreaterThanOrEqual(2);
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
