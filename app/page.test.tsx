import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the page title", () => {
    render(<Home />);
    expect(screen.getByText("mono-space")).toBeInTheDocument();
  });
});
