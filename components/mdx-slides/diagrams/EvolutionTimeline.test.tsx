import { render, screen } from "@testing-library/react";
import { EvolutionTimeline } from "./EvolutionTimeline";

describe("EvolutionTimeline", () => {
  const nodes = [
    { year: "2023", title: "First", subtitle: "Sub 1" },
    { year: "2024", title: "Second", subtitle: "Sub 2", highlight: true, badge: "Key stat" },
  ];

  it("renders all nodes", () => {
    render(<EvolutionTimeline nodes={nodes} />);
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(<EvolutionTimeline nodes={nodes} />);
    expect(screen.getByText("Key stat")).toBeInTheDocument();
  });

  it("renders without crashing when nodes is empty", () => {
    render(<EvolutionTimeline nodes={[]} />);
  });

  it("renders without crashing when nodes is undefined", () => {
    render(<EvolutionTimeline nodes={undefined as unknown as []} />);
  });
});
