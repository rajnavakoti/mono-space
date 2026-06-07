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
    expect(header.style.gridTemplateColumns).toBe("1fr 1fr 1fr");

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
    expect(rows[0].style.gridTemplateColumns).toBe("1fr 1fr 1fr 1fr 1fr");
  });

  it("honors colWeights to make narrative columns wider", () => {
    const { container } = render(
      <CompareTable
        headers="A|B|C"
        rows="x|y|z"
        colWeights="1|1|3"
      />,
    );

    const header = container.querySelector('[class*="compareTableHeader"]') as HTMLElement;
    expect(header.style.gridTemplateColumns).toBe("1fr 1fr 3fr");
  });

  it("highlights cell content wrapped in **markdown bold** via <mark>", () => {
    const { container } = render(
      <CompareTable headers="A|B" rows="ok|**flagged**" />,
    );
    const mark = container.querySelector("mark");
    expect(mark).not.toBeNull();
    expect(mark!.textContent).toBe("flagged");
  });

  it("renders a totals row when totalsRow is provided", () => {
    const { container } = render(
      <CompareTable
        headers="Service|N"
        rows="A|1||B|2"
        totalsRow="TOTAL|**3**"
      />,
    );
    expect(screen.getByText("TOTAL")).toBeInTheDocument();
    // Totals row carries the dedicated class
    const totalsRow = container.querySelector(
      '[class*="compareTableTotalsRow"]',
    );
    expect(totalsRow).not.toBeNull();
    // Highlighted total
    const mark = totalsRow!.querySelector("mark");
    expect(mark!.textContent).toBe("3");
  });
});
