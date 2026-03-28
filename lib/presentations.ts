import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PRESENTATIONS_DIR = path.join(process.cwd(), "content/presentations");

/* === Slide Types === */

export interface TitleSlide {
  type: "title";
  title: string;
  subtitle?: string;
  author?: string;
  event?: string;
  date?: string;
  notes?: string;
}

export interface ContentSlide {
  type: "content";
  title: string;
  body: string[];
  notes?: string;
}

export interface CodeSlide {
  type: "code";
  title: string;
  language: string;
  code: string;
  caption?: string;
  notes?: string;
}

export interface BulletSlide {
  type: "bullets";
  title: string;
  items: string[];
  notes?: string;
}

export interface ImageSlide {
  type: "image";
  title: string;
  src: string;
  alt: string;
  caption?: string;
  notes?: string;
}

export interface TwoColumnSlide {
  type: "two-column";
  title: string;
  left: string[];
  right: string[];
  notes?: string;
}

export interface SectionSlide {
  type: "section";
  title: string;
  subtitle?: string;
  notes?: string;
}

export type Slide =
  | TitleSlide
  | ContentSlide
  | CodeSlide
  | BulletSlide
  | ImageSlide
  | TwoColumnSlide
  | SectionSlide;

/* === Presentation === */

export interface PresentationMeta {
  slug: string;
  title: string;
  event: string;
  date: string;
  description: string;
  slideCount: number;
  format: "json" | "mdx";
}

/* === MDX Presentation === */

export interface MdxPresentationFrontmatter {
  title: string;
  event: string;
  date: string;
  description: string;
  photos?: string[];
}

export interface MdxPresentationRaw {
  slug: string;
  frontmatter: MdxPresentationFrontmatter;
  slideContents: string[];
  photos?: string[];
}

export interface Presentation {
  slug: string;
  title: string;
  event: string;
  date: string;
  description: string;
  slides: Slide[];
  photos?: string[];
}

/* === Helpers === */

/**
 * Split MDX content on `---` delimiters, respecting fenced code blocks.
 * Only `---` on its own line, outside of ``` fences, is treated as a slide break.
 */
export function splitMdxSlides(content: string): string[] {
  const lines = content.split("\n");
  const slides: string[][] = [[]];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
    }

    if (!inCodeBlock && line.trim() === "---") {
      slides.push([]);
    } else {
      slides[slides.length - 1].push(line);
    }
  }

  return slides
    .map((s) => s.join("\n").trim())
    .filter((s) => s.length > 0);
}

/* === Data Access === */

export function getAllPresentations(): PresentationMeta[] {
  if (!fs.existsSync(PRESENTATIONS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(PRESENTATIONS_DIR);

  const jsonMetas = files
    .filter((f) => f.endsWith(".json"))
    .map((filename): PresentationMeta => {
      const slug = filename.replace(/\.json$/, "");
      const filePath = path.join(PRESENTATIONS_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw) as Presentation;

      return {
        slug,
        title: data.title,
        event: data.event,
        date: data.date,
        description: data.description,
        slideCount: data.slides.length,
        format: "json",
      };
    });

  const mdxMetas = files
    .filter((f) => f.endsWith(".mdx"))
    .map((filename): PresentationMeta => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(PRESENTATIONS_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const fm = data as MdxPresentationFrontmatter;
      const slideCount = splitMdxSlides(content).length;

      return {
        slug,
        title: fm.title,
        event: fm.event,
        date: fm.date,
        description: fm.description,
        slideCount,
        format: "mdx",
      };
    });

  return [...jsonMetas, ...mdxMetas].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPresentationBySlug(slug: string): Presentation | null {
  const filePath = path.join(PRESENTATIONS_DIR, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as Presentation;

  return { ...data, slug };
}

export function getMdxPresentationBySlug(
  slug: string
): MdxPresentationRaw | null {
  const filePath = path.join(PRESENTATIONS_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as MdxPresentationFrontmatter;

  return {
    slug,
    frontmatter: fm,
    slideContents: splitMdxSlides(content),
    photos: fm.photos,
  };
}

export function getAllPresentationSlugs(): string[] {
  if (!fs.existsSync(PRESENTATIONS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(PRESENTATIONS_DIR)
    .filter((f) => f.endsWith(".json") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(json|mdx)$/, ""));
}
