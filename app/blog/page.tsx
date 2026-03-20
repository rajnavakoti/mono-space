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
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>BLOG.md</span>
        <span className={styles.sectionMeta}>
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </span>
      </div>
      <BlogList posts={posts} allTags={allTags} />
    </div>
  );
}
