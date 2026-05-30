import { render, screen } from "@testing-library/react";
import { HeatmapMatrix } from "./HeatmapMatrix";

describe("HeatmapMatrix", () => {
  it("renders ✗ marks for filled cells and — for diagonal cells", () => {
    render(<HeatmapMatrix labels="A|B" cells="-|x||.|-" />);

    expect(screen.getAllByText("✗")).toHaveLength(1);
    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("uses rowNames for left labels when provided", () => {
    render(
      <HeatmapMatrix
        labels="A|B"
        rowNames="Apple|Banana"
        cells="-|.||.|-"
      />,
    );

    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    // Short labels still render as col headers
    expect(screen.getAllByText("A")).toHaveLength(1);
    expect(screen.getAllByText("B")).toHaveLength(1);
  });

  it("applies the row-highlight class to the matching row header", () => {
    const { container } = render(
      <HeatmapMatrix
        labels="A|B|C"
        rowNames="Alpha|Beta|Gamma"
        cells="-|x|.||.|-|x||x|.|-"
        highlightRow="Beta"
      />,
    );

    const betaHeader = screen.getByText("Beta");
    expect(betaHeader.className).toMatch(/rowHeaderHighlight/);

    const alphaHeader = screen.getByText("Alpha");
    expect(alphaHeader.className).not.toMatch(/rowHeaderHighlight/);
  });

  it("applies the col-highlight class to the matching col header", () => {
    render(
      <HeatmapMatrix
        labels="X|Y|Z"
        cells="-|x|.||.|-|x||x|.|-"
        highlightCol="Y"
      />,
    );

    const yHeader = screen.getByText("Y");
    expect(yHeader.className).toMatch(/colHeaderHighlight/);
  });
});
