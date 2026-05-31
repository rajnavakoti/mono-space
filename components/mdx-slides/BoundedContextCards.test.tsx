import { render, screen } from "@testing-library/react";
import { BoundedContextCards } from "./BoundedContextCards";

describe("BoundedContextCards", () => {
  it("renders all 6 known contexts + 3 unknown placeholders at v0", () => {
    render(<BoundedContextCards version="0" />);
    for (const n of ["Shipment", "Carrier", "Consignee", "Inventory", "Invoicing", "Tracking"]) {
      expect(screen.getByText(n)).toBeInTheDocument();
    }
    expect(screen.getAllByText("???")).toHaveLength(3);
  });

  it("at v1 shows the Exhibit A findings inside cards", () => {
    render(<BoundedContextCards version="1" />);
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText("↔ circular")).toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.1/)).toBeInTheDocument();
  });
});
