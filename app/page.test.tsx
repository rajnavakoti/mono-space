import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the terminal hero with name and title", () => {
    render(<Home />);
    expect(screen.getByText("Raj Navakoti")).toBeInTheDocument();
    expect(screen.getByText("Staff Software Engineer")).toBeInTheDocument();
  });

  it("renders terminal bar with path", () => {
    render(<Home />);
    expect(screen.getByText("raj@mono-space:~")).toBeInTheDocument();
  });

  it("renders about window panel", () => {
    render(<Home />);
    expect(screen.getByText("ABOUT.md")).toBeInTheDocument();
    expect(screen.getByText(/intersection of software/)).toBeInTheDocument();
  });

  it("renders focus window with indexed items", () => {
    render(<Home />);
    expect(screen.getByText("FOCUS.log")).toBeInTheDocument();
    expect(
      screen.getByText(/Demand-Driven Context framework/)
    ).toBeInTheDocument();
  });

  it("renders speaking window with talks", () => {
    render(<Home />);
    expect(screen.getByText("TALKS.json")).toBeInTheDocument();
    expect(screen.getByText(/upcoming/)).toBeInTheDocument();
    expect(screen.getByText(/past/)).toBeInTheDocument();
  });

  it("renders NEXT badge on upcoming talks", () => {
    render(<Home />);
    expect(screen.getByText("NEXT")).toBeInTheDocument();
  });

  it("renders connect window with links", () => {
    render(<Home />);
    expect(screen.getByText("LINKS.sh")).toBeInTheDocument();
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
