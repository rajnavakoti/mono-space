import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import type { BlogFrontmatter } from "@/lib/blog";
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
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `https://rajnavakoti.dev/blog/${slug}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      url,
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDX<BlogFrontmatter>({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.excerpt,
    datePublished: post.frontmatter.date,
    author: {
      "@type": "Person",
      name: "Raj Navakoti",
    },
    keywords: post.frontmatter.tags.join(", "),
  };

  return (
    <article className={styles.article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.window}>
        <div className={styles.windowBar}>
          <span className={styles.windowLabel}>
            {slug}.mdx
          </span>
          <div className={styles.windowMeta}>
            <time className={styles.date}>{post.frontmatter.date}</time>
            <span className={styles.separator} aria-hidden="true">|</span>
            <span className={styles.readingTime}>{post.readingTime}</span>
          </div>
        </div>
        <div className={styles.windowBody}>
          <header className={styles.header}>
            <h1 className={styles.title}>{post.frontmatter.title}</h1>
            <div className={styles.tags}>
              {post.frontmatter.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className={styles.content}>{content}</div>
        </div>
      </div>

      <footer className={styles.footer}>
        <a href="/blog" className={styles.backLink}>
          &larr; cd /blog
        </a>
      </footer>
    </article>
  );
}
