import { render, screen } from "@testing-library/react";
import WritingsPage from "./page";

describe("WritingsPage", () => {
  it("renders the writings section header", () => {
    render(<WritingsPage />);
    expect(screen.getByText("WRITINGS/")).toBeInTheDocument();
  });

  it("renders writings", () => {
    render(<WritingsPage />);
    expect(
      screen.getByText(/Reverse-Engineering DDD/)
    ).toBeInTheDocument();
  });

  it("renders tag filter buttons", () => {
    render(<WritingsPage />);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });
});
