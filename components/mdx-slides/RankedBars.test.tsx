import { render, screen } from "@testing-library/react";
import { RankedBars } from "./RankedBars";

describe("RankedBars", () => {
  it("renders label + value for each bar", () => {
    render(<RankedBars bars="Alpha::23::red|Beta::17::amber|Gamma::5::green" />);

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("scales bar widths by max value derived from bars", () => {
    const { container } = render(
      <RankedBars bars="Top::20::red|Mid::10::amber|Low::5::green" />,
    );

    const fills = container.querySelectorAll('[class*="fill"]') as NodeListOf<HTMLElement>;
    expect(fills[0].style.width).toBe("100%");
    expect(fills[1].style.width).toBe("50%");
    expect(fills[2].style.width).toBe("25%");
  });

  it("honors an explicit max prop", () => {
    const { container } = render(
      <RankedBars bars="A::10::red|B::5::amber" max={100} />,
    );

    const fills = container.querySelectorAll('[class*="fill"]') as NodeListOf<HTMLElement>;
    expect(fills[0].style.width).toBe("10%");
    expect(fills[1].style.width).toBe("5%");
  });
});
