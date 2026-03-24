import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WritingsList } from "./WritingsList";
import type { WritingMeta } from "@/lib/writings";

const mockWritings: WritingMeta[] = [
  {
    slug: "post-one",
    frontmatter: {
      title: "Post One",
      date: "2026-03-01",
      tags: ["DDD", "architecture"],
      excerpt: "First post excerpt",
      published: true,
    },
    readingTime: "3 min read",
  },
  {
    slug: "post-two",
    frontmatter: {
      title: "Post Two",
      date: "2026-02-15",
      tags: ["AI"],
      excerpt: "Second post excerpt",
      published: true,
      externalUrl: "https://example.com/post-two",
      platform: "Medium",
    },
    readingTime: "5 min read",
  },
];

const allTags = ["AI", "DDD", "architecture"];

describe("WritingsList", () => {
  it("renders all writings by default", () => {
    render(<WritingsList writings={mockWritings} allTags={allTags} />);
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("renders platform badge for external writings", () => {
    render(<WritingsList writings={mockWritings} allTags={allTags} />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("links external writings to external URL", () => {
    render(<WritingsList writings={mockWritings} allTags={allTags} />);
    const externalLink = screen.getByRole("link", { name: /Post Two/ });
    expect(externalLink).toHaveAttribute("href", "https://example.com/post-two");
    expect(externalLink).toHaveAttribute("target", "_blank");
  });

  it("links internal writings to /writings/slug", () => {
    render(<WritingsList writings={mockWritings} allTags={allTags} />);
    const internalLink = screen.getByRole("link", { name: /Post One/ });
    expect(internalLink).toHaveAttribute("href", "/writings/post-one");
  });

  it("filters writings when a tag is clicked", async () => {
    const user = userEvent.setup();
    render(<WritingsList writings={mockWritings} allTags={allTags} />);

    await user.click(screen.getByRole("button", { name: "AI" }));

    expect(screen.queryByText("Post One")).not.toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("shows empty message when no writings match filter", async () => {
    const user = userEvent.setup();
    render(<WritingsList writings={[mockWritings[0]]} allTags={["AI", "DDD"]} />);

    await user.click(screen.getByRole("button", { name: "AI" }));

    expect(screen.getByText("// no writings matching this filter")).toBeInTheDocument();
  });
});
