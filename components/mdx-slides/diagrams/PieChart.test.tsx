import { render } from "@testing-library/react";
import { PieChart } from "./PieChart";

describe("PieChart", () => {
  it("renders without crashing", () => {
    render(<PieChart slices="A::60|B::40::highlight" />);
  });

  it("renders with annotations", () => {
    render(<PieChart slices="A::60|B::40" annotations="first|second" />);
  });

  it("renders without crashing when slices is empty", () => {
    render(<PieChart slices="" />);
  });

  it("renders without crashing when slices is undefined", () => {
    render(<PieChart slices={undefined as unknown as string} />);
  });
});
