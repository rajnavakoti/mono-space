"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";
import styles from "./BlogList.module.css";

interface BlogListProps {
  posts: BlogPostMeta[];
  allTags: string[];
}

export function BlogList({ posts, allTags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.frontmatter.tags.includes(activeTag))
    : posts;

  return (
    <>
      <div className={styles.tagFilter} role="group" aria-label="Filter by tag">
        <button
          className={`${styles.tagButton} ${!activeTag ? styles.tagActive : ""}`}
          onClick={() => setActiveTag(null)}
          aria-pressed={!activeTag}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`${styles.tagButton} ${activeTag === tag ? styles.tagActive : ""}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            aria-pressed={activeTag === tag}
          >
            {tag}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>No posts with this tag.</p>
      ) : (
        <ul className={styles.postList}>
          {filtered.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.postLink}>
                <article className={styles.postCard}>
                  <div className={styles.postMeta}>
                    <time className={styles.date}>
                      {post.frontmatter.date}
                    </time>
                    <span className={styles.readingTime}>
                      {post.readingTime}
                    </span>
                  </div>
                  <h2 className={styles.postTitle}>
                    {post.frontmatter.title}
                  </h2>
                  <p className={styles.excerpt}>
                    {post.frontmatter.excerpt}
                  </p>
                  <div className={styles.tags}>
                    {post.frontmatter.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
