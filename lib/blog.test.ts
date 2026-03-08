import { getAllPosts, getPostBySlug, getAllTags, getAllSlugs } from "./blog";

describe("blog utilities", () => {
  it("returns all published posts sorted by date (newest first)", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);

    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].frontmatter.date).getTime();
      const curr = new Date(posts[i].frontmatter.date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it("returns frontmatter with required fields", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(post.frontmatter.title).toBeDefined();
      expect(post.frontmatter.date).toBeDefined();
      expect(post.frontmatter.tags).toBeInstanceOf(Array);
      expect(post.frontmatter.excerpt).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.readingTime).toBeDefined();
    }
  });

  it("gets a post by slug with content", () => {
    const post = getPostBySlug("reverse-engineering-ddd");
    expect(post).not.toBeNull();
    expect(post!.frontmatter.title).toContain("Reverse-Engineering DDD");
    expect(post!.content).toContain("Most teams discover");
    expect(post!.readingTime).toBeDefined();
  });

  it("returns null for non-existent slug", () => {
    const post = getPostBySlug("non-existent-post");
    expect(post).toBeNull();
  });

  it("returns all unique tags sorted", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i] >= tags[i - 1]).toBe(true);
    }
  });

  it("returns all slugs", () => {
    const slugs = getAllSlugs();
    expect(slugs).toContain("reverse-engineering-ddd");
  });
});
