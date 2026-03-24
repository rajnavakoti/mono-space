import { getAllWritings, getWritingBySlug, getAllTags, getAllSlugs } from "./writings";

describe("writings utilities", () => {
  it("returns all published writings sorted by date (newest first)", () => {
    const writings = getAllWritings();
    expect(writings.length).toBeGreaterThan(0);

    for (let i = 1; i < writings.length; i++) {
      const prev = new Date(writings[i - 1].frontmatter.date).getTime();
      const curr = new Date(writings[i].frontmatter.date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it("returns frontmatter with required fields", () => {
    const writings = getAllWritings();
    for (const writing of writings) {
      expect(writing.frontmatter.title).toBeDefined();
      expect(writing.frontmatter.date).toBeDefined();
      expect(writing.frontmatter.tags).toBeInstanceOf(Array);
      expect(writing.frontmatter.excerpt).toBeDefined();
      expect(writing.slug).toBeDefined();
      expect(writing.readingTime).toBeDefined();
    }
  });

  it("gets a writing by slug with content", () => {
    const writing = getWritingBySlug("demand-driven-context");
    expect(writing).not.toBeNull();
    expect(writing!.frontmatter.title).toContain("Demand-Driven Context");
    expect(writing!.content).toBeTruthy();
    expect(writing!.readingTime).toBeDefined();
  });

  it("returns null for non-existent slug", () => {
    const writing = getWritingBySlug("non-existent-post");
    expect(writing).toBeNull();
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
    expect(slugs).toContain("demand-driven-context");
    expect(slugs).toContain("architecture-catalog");
  });
});
