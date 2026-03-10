import { render, screen } from "@testing-library/react";
import { TypingEffect } from "./TypingEffect";

describe("TypingEffect", () => {
  it("renders with a cursor initially", () => {
    render(<TypingEffect text="hello" delay={0} />);
    expect(screen.getByText("_")).toBeInTheDocument();
  });

  it("accepts a custom className", () => {
    const { container } = render(
      <TypingEffect text="test" className="custom" />
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });
});
