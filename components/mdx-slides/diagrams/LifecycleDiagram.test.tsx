import { render, screen } from "@testing-library/react";
import { LifecycleDiagram } from "./LifecycleDiagram";

describe("LifecycleDiagram", () => {
  it("renders all step labels", () => {
    render(<LifecycleDiagram steps="STEP 1|STEP 2|STEP 3" />);
    expect(screen.getByText("STEP 1")).toBeInTheDocument();
    expect(screen.getByText("STEP 2")).toBeInTheDocument();
    expect(screen.getByText("STEP 3")).toBeInTheDocument();
  });

  it("renders center text when provided", () => {
    render(<LifecycleDiagram steps="A|B|C" centerText="30 min" />);
    expect(screen.getByText("30 min")).toBeInTheDocument();
  });

  it("renders without crashing when steps is empty", () => {
    render(<LifecycleDiagram steps="" />);
  });

  it("renders without crashing when steps is undefined", () => {
    render(<LifecycleDiagram steps={undefined as unknown as string} />);
  });
});
