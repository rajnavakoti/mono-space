import { render, screen } from "@testing-library/react";
import { SchemaZoomedMap } from "./SchemaZoomedMap";

describe("SchemaZoomedMap", () => {
  it("renders 6 named schema windows + 3 unknown placeholders at v0", () => {
    render(<SchemaZoomedMap version="0" />);
    for (const n of ["shipment", "carrier", "consignee", "inventory", "invoicing", "tracking"]) {
      expect(screen.getByText(n)).toBeInTheDocument();
    }
    expect(screen.getAllByText("?")).toHaveLength(3);
  });

  it("at v1 adds the god-entity borrowed fields + amber notes", () => {
    render(<SchemaZoomedMap version="1" />);
    expect(screen.getByText("⚠ god entity")).toBeInTheDocument();
    expect(screen.getByText("0 events")).toBeInTheDocument();
    expect(screen.getByText(/Hypothesis v0\.1/)).toBeInTheDocument();
  });
});
