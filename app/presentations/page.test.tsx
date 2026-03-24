import { render, screen } from "@testing-library/react";
import PresentationsPage from "./page";

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

describe("PresentationsPage", () => {
  it("renders the presentations section header", () => {
    render(<PresentationsPage />);
    expect(screen.getByText("TALKS/")).toBeInTheDocument();
  });

  it("renders presentation cards", () => {
    render(<PresentationsPage />);
    expect(
      screen.getByText(/Teaching AI Agents to Remember/)
    ).toBeInTheDocument();
  });

  it("shows event name and slide count", () => {
    render(<PresentationsPage />);
    expect(screen.getByText("AI Builders Amsterdam")).toBeInTheDocument();
    expect(screen.getByText("12 slides")).toBeInTheDocument();
  });

  it("links to individual presentations", () => {
    render(<PresentationsPage />);
    const link = screen.getByRole("link", {
      name: /Teaching AI Agents/,
    });
    expect(link).toHaveAttribute(
      "href",
      "/presentations/ai-builders-ddc"
    );
  });
});
