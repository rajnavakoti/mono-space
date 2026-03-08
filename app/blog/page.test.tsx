import { render, screen } from "@testing-library/react";
import BlogPage from "./page";

describe("BlogPage", () => {
  it("renders the blog heading", () => {
    render(<BlogPage />);
    expect(screen.getByText("// blog")).toBeInTheDocument();
  });

  it("renders blog posts", () => {
    render(<BlogPage />);
    expect(
      screen.getByText(/Reverse-Engineering DDD/)
    ).toBeInTheDocument();
  });

  it("renders tag filter buttons", () => {
    render(<BlogPage />);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });
});
