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
      <div className={styles.window}>
        <div className={styles.windowBar}>
          <span className={styles.windowLabel}>BLOG.md</span>
          <span className={styles.windowMeta}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
        <div className={styles.windowBody}>
          <BlogList posts={posts} allTags={allTags} />
        </div>
      </div>
    </div>
  );
}
