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
  it("renders the presentations heading", () => {
    render(<PresentationsPage />);
    expect(screen.getByText("// presentations")).toBeInTheDocument();
  });

  it("renders presentation cards", () => {
    render(<PresentationsPage />);
    expect(
      screen.getByText(/Demand-Driven Context/)
    ).toBeInTheDocument();
  });

  it("shows event name and slide count", () => {
    render(<PresentationsPage />);
    expect(screen.getByText("NDC 2026")).toBeInTheDocument();
    expect(screen.getByText("10 slides")).toBeInTheDocument();
  });

  it("links to individual presentations", () => {
    render(<PresentationsPage />);
    const link = screen.getByRole("link", {
      name: /Demand-Driven Context/,
    });
    expect(link).toHaveAttribute(
      "href",
      "/presentations/demand-driven-context"
    );
  });
});
