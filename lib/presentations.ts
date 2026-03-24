import fs from "fs";
import path from "path";

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

/* === Data Access === */

export function getAllPresentations(): PresentationMeta[] {
  if (!fs.existsSync(PRESENTATIONS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(PRESENTATIONS_DIR)
    .filter((f) => f.endsWith(".json"));

  const presentations = files
    .map((filename) => {
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
      };
    })
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return presentations;
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

export function getAllPresentationSlugs(): string[] {
  if (!fs.existsSync(PRESENTATIONS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(PRESENTATIONS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}
