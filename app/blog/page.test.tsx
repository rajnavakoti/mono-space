import { render, screen } from "@testing-library/react";
import BlogPage from "./page";

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

describe("BlogPage", () => {
  it("renders the blog heading", () => {
    render(<BlogPage />);
    expect(screen.getByText("// blog")).toBeInTheDocument();
  });

  it("renders blog posts with titles", () => {
    render(<BlogPage />);
    expect(
      screen.getByText(/Reverse-Engineering DDD/)
    ).toBeInTheDocument();
  });

  it("shows reading time for each post", () => {
    render(<BlogPage />);
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });

  it("shows tags for each post", () => {
    render(<BlogPage />);
    expect(screen.getByText("DDD")).toBeInTheDocument();
    expect(screen.getByText("architecture")).toBeInTheDocument();
  });

  it("links to individual blog posts", () => {
    render(<BlogPage />);
    const link = screen.getByRole("link", {
      name: /Reverse-Engineering DDD/,
    });
    expect(link).toHaveAttribute(
      "href",
      "/blog/reverse-engineering-ddd"
    );
  });
});
