import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the hero section with name and title", () => {
    render(<Home />);
    expect(screen.getByText("Raj Navakoti")).toBeInTheDocument();
    expect(screen.getByText("Staff Software Engineer")).toBeInTheDocument();
  });

  it("renders about section", () => {
    render(<Home />);
    expect(screen.getByText("// about")).toBeInTheDocument();
  });

  it("renders current focus items", () => {
    render(<Home />);
    expect(screen.getByText("// current focus")).toBeInTheDocument();
    expect(
      screen.getByText(/Demand-Driven Context framework/)
    ).toBeInTheDocument();
  });

  it("renders speaking engagements", () => {
    render(<Home />);
    expect(screen.getByText("// speaking")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(screen.getByText("Past")).toBeInTheDocument();
  });

  it("renders connect links", () => {
    render(<Home />);
    expect(screen.getByText("// connect")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Email/ })).toBeInTheDocument();
  });

  it("opens external links in new tab", () => {
    render(<Home />);
    const githubLink = screen.getByRole("link", { name: /GitHub/ });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
