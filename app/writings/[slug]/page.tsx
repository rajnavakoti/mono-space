import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllSlugs, getWritingBySlug } from "@/lib/writings";
import type { WritingFrontmatter } from "@/lib/writings";
import type { Metadata } from "next";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);
  if (!writing) return {};

  const url = `https://rajnavakoti.dev/writings/${slug}`;

  return {
    title: writing.frontmatter.title,
    description: writing.frontmatter.excerpt,
    openGraph: {
      type: "article",
      title: writing.frontmatter.title,
      description: writing.frontmatter.excerpt,
      url,
      publishedTime: writing.frontmatter.date,
      tags: writing.frontmatter.tags,
    },
  };
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);

  if (!writing) {
    notFound();
  }

  const { content } = await compileMDX<WritingFrontmatter>({
    source: writing.content,
    options: { parseFrontmatter: false },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: writing.frontmatter.title,
    description: writing.frontmatter.excerpt,
    datePublished: writing.frontmatter.date,
    author: {
      "@type": "Person",
      name: "Raj Navakoti",
    },
    keywords: writing.frontmatter.tags.join(", "),
  };

  return (
    <article className={styles.article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>
          {slug}.mdx
        </span>
        <div className={styles.windowMeta}>
          <time className={styles.date}>{writing.frontmatter.date}</time>
          <span className={styles.separator} aria-hidden="true">|</span>
          <span className={styles.readingTime}>{writing.readingTime}</span>
        </div>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title}>{writing.frontmatter.title}</h1>
        <div className={styles.tags}>
          {writing.frontmatter.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.content}>{content}</div>

      <footer className={styles.footer}>
        <a href="/writings" className={styles.backLink}>
          &larr; cd /writings
        </a>
      </footer>
    </article>
  );
}
