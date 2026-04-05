import { render, screen } from "@testing-library/react";
import { FlowBox, FlowArrow, FlowRow, FlowColumn } from "./FlowDiagram";

describe("FlowDiagram components", () => {
  it("renders FlowBox with children", () => {
    render(<FlowBox>Test Box</FlowBox>);
    expect(screen.getByText("Test Box")).toBeInTheDocument();
  });

  it("renders FlowArrow right", () => {
    render(<FlowArrow direction="right" />);
    expect(screen.getByText("▶")).toBeInTheDocument();
  });

  it("renders FlowArrow down", () => {
    render(<FlowArrow direction="down" />);
    expect(screen.getByText("▼")).toBeInTheDocument();
  });

  it("renders FlowRow with children", () => {
    render(
      <FlowRow>
        <FlowBox>A</FlowBox>
        <FlowBox>B</FlowBox>
      </FlowRow>
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders FlowColumn with children", () => {
    render(
      <FlowColumn>
        <FlowBox>Top</FlowBox>
        <FlowBox>Bottom</FlowBox>
      </FlowColumn>
    );
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Bottom")).toBeInTheDocument();
  });

  it("applies accent style", () => {
    const { container } = render(<FlowBox accent>Accent</FlowBox>);
    expect(container.firstChild).toHaveClass(/flowBoxAccent/);
  });
});
