import { render, screen } from "@testing-library/react";
import { ContextMap } from "./ContextMap";

describe("ContextMap", () => {
  it("at v0 renders all 6 known contexts + 3 unknowns with no findings", () => {
    render(<ContextMap version="0" />);
    for (const n of ["Shipment", "Carrier", "Consignee", "Inventory", "Invoicing", "Tracking"]) {
      expect(screen.getByText(n)).toBeInTheDocument();
    }
    expect(screen.getAllByText("???")).toHaveLength(3);
    expect(screen.queryByText("⚠ god entity")).not.toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.0/)).toBeInTheDocument();
  });

  it("at v1 shows contract-archaeology findings inside cards", () => {
    render(<ContextMap version="1" />);
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText("↔ circular")).toBeInTheDocument();
    expect(screen.getByText("infra?")).toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.1/)).toBeInTheDocument();
  });

  it("at v2 marks Inventory red (2 writers) and adds facade to Consignee", () => {
    render(<ContextMap version="2" />);
    expect(screen.getByText("2 writers")).toBeInTheDocument();
    expect(screen.getByText("facade")).toBeInTheDocument();
  });

  it("at v7 reveals Returns/Policy in place of the middle unknown", () => {
    render(<ContextMap version="7" />);
    expect(screen.getByText("Returns/Policy")).toBeInTheDocument();
    expect(screen.getAllByText("???")).toHaveLength(2);
    expect(screen.getByText(/Hypothesis v0\.7/)).toBeInTheDocument();
  });

  it("at v8 Carrier flips from READY to NOT READY (Exhibit H override)", () => {
    render(<ContextMap version="8" />);
    expect(screen.getByText(/NOT READY/)).toBeInTheDocument();
    expect(screen.queryByText("READY ✓")).not.toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.8/)).toBeInTheDocument();
  });

  it("accepts version as a number for TS callsites (MDX uses string)", () => {
    render(<ContextMap version={1 as unknown as "1"} />);
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
  });

  it("clamps out-of-range versions to v0 and v8", () => {
    const { rerender } = render(<ContextMap version="99" />);
    expect(screen.getByText(/Hypothesis v0\.8/)).toBeInTheDocument();
    rerender(<ContextMap version="bogus" />);
    expect(screen.getByText(/Hypothesis v0\.0/)).toBeInTheDocument();
  });
});
