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
    expect(screen.getByText(/enterprise architecture less painful/)).toBeInTheDocument();
  });

  it("renders focus window with indexed items", () => {
    render(<Home />);
    expect(screen.getByText("FOCUS.log")).toBeInTheDocument();
    expect(
      screen.getByText(/DDC Framework/)
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
    expect(screen.getAllByText("NEXT").length).toBeGreaterThan(0);
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

  it("renders profile photo with alt text", () => {
    render(<Home />);
    const photo = screen.getByAltText("Raj Navakoti");
    expect(photo).toBeInTheDocument();
  });

  it("renders quote below photo", () => {
    render(<Home />);
    expect(screen.getByText(/best architectures emerge/)).toBeInTheDocument();
  });


});
