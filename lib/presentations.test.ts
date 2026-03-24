import {
  getAllPresentations,
  getPresentationBySlug,
  getAllPresentationSlugs,
} from "./presentations";

describe("presentation utilities", () => {
  it("returns all presentations sorted by date", () => {
    const presentations = getAllPresentations();
    expect(presentations.length).toBeGreaterThan(0);

    for (let i = 1; i < presentations.length; i++) {
      const prev = new Date(presentations[i - 1].date).getTime();
      const curr = new Date(presentations[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it("returns presentation metadata with slide count", () => {
    const presentations = getAllPresentations();
    for (const p of presentations) {
      expect(p.title).toBeDefined();
      expect(p.event).toBeDefined();
      expect(p.date).toBeDefined();
      expect(p.description).toBeDefined();
      expect(p.slideCount).toBeGreaterThan(0);
      expect(p.slug).toBeDefined();
    }
  });

  it("gets a presentation by slug with slides", () => {
    const pres = getPresentationBySlug("ai-builders-ddc");
    expect(pres).not.toBeNull();
    expect(pres!.title).toContain("Demand-Driven Context");
    expect(pres!.slides.length).toBe(12);
    expect(pres!.slides[0].type).toBe("title");
  });

  it("returns null for non-existent slug", () => {
    const pres = getPresentationBySlug("non-existent");
    expect(pres).toBeNull();
  });

  it("returns all slugs", () => {
    const slugs = getAllPresentationSlugs();
    expect(slugs).toContain("ai-builders-ddc");
  });

  it("validates slide types", () => {
    const pres = getPresentationBySlug("ai-builders-ddc");
    expect(pres).not.toBeNull();

    const types = pres!.slides.map((s) => s.type);
    expect(types).toContain("title");
    expect(types).toContain("bullets");
    expect(types).toContain("content");
    expect(types).toContain("two-column");
    expect(types).toContain("section");
  });
});
