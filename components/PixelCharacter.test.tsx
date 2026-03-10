import { render } from "@testing-library/react";
import { PixelCharacter } from "./PixelCharacter";

describe("PixelCharacter", () => {
  it("renders with aria-hidden for accessibility", () => {
    const { container } = render(<PixelCharacter type="reader" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("applies the correct type class", () => {
    const { container } = render(<PixelCharacter type="coder" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("coder");
  });

  it("accepts a custom className", () => {
    const { container } = render(
      <PixelCharacter type="speaker" className="custom" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("custom");
  });

  it("renders the sprite element", () => {
    const { container } = render(<PixelCharacter type="waver" />);
    expect(container.querySelector("[class*='sprite']")).toBeInTheDocument();
  });
});
