import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import styles from "./page.module.css";

export const metadata = {
  title: "Blog",
  description: "Writing about DDD, architecture, AI, and software engineering.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>// blog</h1>
        <p className={styles.subtitle}>
          Writing about architecture, DDD, AI, and engineering.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className={styles.empty}>No posts yet.</p>
      ) : (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={styles.postLink}
              >
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
    </div>
  );
}
