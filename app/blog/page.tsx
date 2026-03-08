import { getAllPosts, getAllTags } from "@/lib/blog";
import { BlogList } from "@/components/BlogList";
import styles from "./page.module.css";

export const metadata = {
  title: "Blog",
  description: "Writing about DDD, architecture, AI, and software engineering.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const allTags = getAllTags();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>// blog</h1>
        <p className={styles.subtitle}>
          Writing about architecture, DDD, AI, and engineering.
        </p>
      </header>

      <BlogList posts={posts} allTags={allTags} />
    </div>
  );
}
