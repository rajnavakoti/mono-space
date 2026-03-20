import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const WRITINGS_DIR = path.join(process.cwd(), "content/writings");

export interface WritingFrontmatter {
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  published: boolean;
}

export interface Writing {
  slug: string;
  frontmatter: WritingFrontmatter;
  readingTime: string;
  content: string;
}

export interface WritingMeta {
  slug: string;
  frontmatter: WritingFrontmatter;
  readingTime: string;
}

export function getAllWritings(): WritingMeta[] {
  if (!fs.existsSync(WRITINGS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(WRITINGS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(WRITINGS_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const frontmatter = data as WritingFrontmatter;

      if (!frontmatter.published) {
        return null;
      }

      const stats = readingTime(content);

      return {
        slug,
        frontmatter,
        readingTime: stats.text,
      };
    })
    .filter((post): post is WritingMeta => post !== null);

  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );

  return posts;
}

export function getWritingBySlug(slug: string): Writing | null {
  const filePath = path.join(WRITINGS_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as WritingFrontmatter;
  const stats = readingTime(content);

  return {
    slug,
    frontmatter,
    readingTime: stats.text,
    content,
  };
}

export function getAllTags(): string[] {
  const posts = getAllWritings();
  const tagSet = new Set<string>();

  for (const post of posts) {
    for (const tag of post.frontmatter.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(WRITINGS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(WRITINGS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
