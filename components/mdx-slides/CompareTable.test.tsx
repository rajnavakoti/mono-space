import { render, screen } from "@testing-library/react";
import { CompareTable } from "./CompareTable";

describe("CompareTable", () => {
  it("renders a 2-column table from header + row strings", () => {
    render(<CompareTable headers="A|B" rows="1|2||3|4" />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("uses a 3-column grid template when 3 headers are provided", () => {
    const { container } = render(
      <CompareTable headers="Service|Name|ID" rows="Shipment|buyer|buyerId||Consignee|customer|customerId" />,
    );

    const header = container.querySelector('[class*="compareTableHeader"]') as HTMLElement;
    expect(header).not.toBeNull();
    expect(header.style.gridTemplateColumns).toBe("repeat(3, 1fr)");

    // All 6 data cells render
    expect(screen.getByText("Shipment")).toBeInTheDocument();
    expect(screen.getByText("buyer")).toBeInTheDocument();
    expect(screen.getByText("buyerId")).toBeInTheDocument();
    expect(screen.getByText("customer")).toBeInTheDocument();
  });

  it("uses a 5-column grid template for wide tables", () => {
    const { container } = render(
      <CompareTable
        headers="Concept|Shipment|Consignee|Carrier|Invoicing"
        rows="Street|line1|streetAddress|street|addressLine1"
      />,
    );

    const rows = container.querySelectorAll('[class*="compareTableRow"]') as NodeListOf<HTMLElement>;
    expect(rows).toHaveLength(1);
    expect(rows[0].style.gridTemplateColumns).toBe("repeat(5, 1fr)");
  });
});
