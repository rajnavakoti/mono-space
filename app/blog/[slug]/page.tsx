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

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.excerpt,
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

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <time className={styles.date}>{post.frontmatter.date}</time>
          <span className={styles.readingTime}>{post.readingTime}</span>
        </div>
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

      <footer className={styles.footer}>
        <a href="/blog" className={styles.backLink}>
          &larr; Back to blog
        </a>
      </footer>
    </article>
  );
}
