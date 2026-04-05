import { render, screen } from "@testing-library/react";
import { LifecycleDiagram } from "./LifecycleDiagram";

describe("LifecycleDiagram", () => {
  const nodes = [
    { label: "STEP 1" },
    { label: "STEP 2", color: "#B55A5A" },
    { label: "STEP 3", color: "#5AB55A" },
  ];

  it("renders all node labels", () => {
    render(<LifecycleDiagram nodes={nodes} />);
    expect(screen.getByText("STEP 1")).toBeInTheDocument();
    expect(screen.getByText("STEP 2")).toBeInTheDocument();
    expect(screen.getByText("STEP 3")).toBeInTheDocument();
  });

  it("renders center text when provided", () => {
    render(<LifecycleDiagram nodes={nodes} centerText="30 min" />);
    expect(screen.getByText("30 min")).toBeInTheDocument();
  });

  it("renders without crashing when nodes is empty", () => {
    render(<LifecycleDiagram nodes={[]} />);
  });

  it("renders without crashing when nodes is undefined", () => {
    render(<LifecycleDiagram nodes={undefined as unknown as []} />);
  });
});
