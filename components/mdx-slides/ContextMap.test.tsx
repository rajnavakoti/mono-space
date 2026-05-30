import { render, screen } from "@testing-library/react";
import { ContextMap } from "./ContextMap";

describe("ContextMap", () => {
  it("renders all baseline circles at v0 with no extra labels", () => {
    render(<ContextMap version={0} />);

    // The six known service circles
    for (const name of ["Shipment", "Carrier", "Consignee", "Inventory", "Invoicing", "Tracking"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    // Three ??? bottom-row circles
    expect(screen.getAllByText("???")).toHaveLength(3);
    // v0 caption
    expect(screen.getByText(/Hypothesis v0\.0/)).toBeInTheDocument();
    // No sublabels yet
    expect(screen.queryByText("⚠ GOD")).not.toBeInTheDocument();
    expect(screen.queryByText("0 events")).not.toBeInTheDocument();
  });

  it("at v1 shows GOD label on Shipment and '0 events' on Consignee", () => {
    render(<ContextMap version={1} />);

    expect(screen.getByText("⚠ GOD")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.1/)).toBeInTheDocument();
  });

  it("at v7 reveals Returns/Policy and leaves two ??? circles", () => {
    render(<ContextMap version={7} />);

    expect(screen.getByText("Returns/Policy")).toBeInTheDocument();
    expect(screen.getAllByText("???")).toHaveLength(2);
    expect(screen.getByText(/Hypothesis v0\.7/)).toBeInTheDocument();
  });

  it("at v8 shows MERGE label and surfaces NOT READY override on Carrier", () => {
    render(<ContextMap version={8} />);

    expect(screen.getByText("NOT READY (72% co-change)")).toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.8/)).toBeInTheDocument();
  });

  it("accepts version as a string (MDX prop interop)", () => {
    // MDX passes string attribute values; the component must normalize them.
    render(<ContextMap version={"1" as unknown as 1} />);

    expect(screen.getByText("⚠ GOD")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.1/)).toBeInTheDocument();
  });

  it("clamps out-of-range or non-numeric versions to v0", () => {
    const { rerender } = render(<ContextMap version={"99" as unknown as 8} />);
    expect(screen.getByText(/Hypothesis v0\.8/)).toBeInTheDocument(); // 99 → 8

    rerender(<ContextMap version={"not-a-number" as unknown as 0} />);
    expect(screen.getByText(/Hypothesis v0\.0/)).toBeInTheDocument(); // NaN → 0
  });
});
