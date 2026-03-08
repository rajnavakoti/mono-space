import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogList } from "./BlogList";
import type { BlogPostMeta } from "@/lib/blog";

const mockPosts: BlogPostMeta[] = [
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
    },
    readingTime: "5 min read",
  },
];

const allTags = ["AI", "DDD", "architecture"];

describe("BlogList", () => {
  it("renders all posts by default", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("renders tag filter buttons", () => {
    render(<BlogList posts={mockPosts} allTags={allTags} />);
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "DDD" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AI" })).toBeInTheDocument();
  });

  it("filters posts when a tag is clicked", async () => {
    const user = userEvent.setup();
    render(<BlogList posts={mockPosts} allTags={allTags} />);

    await user.click(screen.getByRole("button", { name: "AI" }));

    expect(screen.queryByText("Post One")).not.toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("clears filter when clicking the same tag again", async () => {
    const user = userEvent.setup();
    render(<BlogList posts={mockPosts} allTags={allTags} />);

    await user.click(screen.getByRole("button", { name: "AI" }));
    await user.click(screen.getByRole("button", { name: "AI" }));

    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("clears filter when All is clicked", async () => {
    const user = userEvent.setup();
    render(<BlogList posts={mockPosts} allTags={allTags} />);

    await user.click(screen.getByRole("button", { name: "AI" }));
    await user.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });

  it("shows empty message when no posts match filter", async () => {
    const user = userEvent.setup();
    render(<BlogList posts={[mockPosts[0]]} allTags={["AI", "DDD"]} />);

    await user.click(screen.getByRole("button", { name: "AI" }));

    expect(screen.getByText("No posts with this tag.")).toBeInTheDocument();
  });
});
