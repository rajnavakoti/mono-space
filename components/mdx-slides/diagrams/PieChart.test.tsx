import { render, screen } from "@testing-library/react";
import { PieChart } from "./PieChart";

describe("PieChart", () => {
  const slices = [
    { label: "A", percent: 60, color: "#red" },
    { label: "B", percent: 40, color: "#blue", highlight: true },
  ];

  it("renders all legend items", () => {
    render(<PieChart slices={slices} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("renders source when provided", () => {
    render(<PieChart slices={slices} source="Test source" />);
    expect(screen.getByText("Test source")).toBeInTheDocument();
  });

  it("renders without crashing when slices is empty", () => {
    render(<PieChart slices={[]} />);
  });

  it("renders without crashing when slices is undefined", () => {
    render(<PieChart slices={undefined as unknown as []} />);
  });
});
