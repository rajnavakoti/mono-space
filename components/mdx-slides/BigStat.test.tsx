import { render, screen } from "@testing-library/react";
import { BigStat } from "./BigStat";

describe("BigStat", () => {
  it("renders the value and label", () => {
    render(<BigStat value="83" label="incidents in 12 months" />);
    expect(screen.getByText("83")).toBeInTheDocument();
    expect(screen.getByText(/incidents in 12 months/i)).toBeInTheDocument();
  });

  it("renders without a label when label is omitted", () => {
    render(<BigStat value="77%" />);
    expect(screen.getByText("77%")).toBeInTheDocument();
  });

  it("applies the tone class for amber/red/green", () => {
    const { rerender, container } = render(<BigStat value="1" tone="amber" />);
    expect(container.firstChild?.className).toMatch(/toneAmber/);
    rerender(<BigStat value="1" tone="red" />);
    expect(container.firstChild?.className).toMatch(/toneRed/);
    rerender(<BigStat value="1" tone="green" />);
    expect(container.firstChild?.className).toMatch(/toneGreen/);
  });
});
