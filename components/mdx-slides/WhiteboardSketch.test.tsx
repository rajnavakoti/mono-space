import { render, screen } from "@testing-library/react";
import { WhiteboardSketch } from "./WhiteboardSketch";

describe("WhiteboardSketch", () => {
  it("renders all 6 known contexts + 3 unknown boxes at v0", () => {
    render(<WhiteboardSketch version="0" />);
    for (const n of ["Shipment", "Carrier", "Consignee", "Inventory", "Invoicing", "Tracking"]) {
      expect(screen.getByText(n)).toBeInTheDocument();
    }
    expect(screen.getAllByText("?")).toHaveLength(3);
  });

  it("at v1 surfaces sticky-note findings around target boxes", () => {
    render(<WhiteboardSketch version="1" />);
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.1/)).toBeInTheDocument();
  });
});
