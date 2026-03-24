"use client";

import { useState } from "react";
import Link from "next/link";
import type { WritingMeta } from "@/lib/writings";
import { PlaceholderCover } from "./PlaceholderCover";
import styles from "./WritingsList.module.css";

interface WritingsListProps {
  writings: WritingMeta[];
  allTags: string[];
}

function WritingCard({ writing }: { writing: WritingMeta }) {
  const externalUrl = writing.frontmatter.externalUrl;
  const platform = writing.frontmatter.platform;
  const isExternal = externalUrl && externalUrl.length > 0;

  const card = (
    <article className={styles.postCard}>
      <PlaceholderCover title={writing.frontmatter.title} />
      <div className={styles.postBar}>
        <time className={styles.date}>
          {writing.frontmatter.date}
        </time>
        <span className={styles.readingTime}>
          {writing.readingTime}
        </span>
        {platform && (
          <span className={styles.platform}>{platform}</span>
        )}
      </div>
      <div className={styles.postBody}>
        <h2 className={styles.postTitle}>
          {writing.frontmatter.title}
          {isExternal && <span className={styles.externalIcon}> &rarr;</span>}
        </h2>
        <p className={styles.excerpt}>
          {writing.frontmatter.excerpt}
        </p>
        <div className={styles.tags}>
          {writing.frontmatter.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  if (isExternal) {
    return (
      <a
        href={externalUrl}
        className={styles.postLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {card}
      </a>
    );
  }

  return (
    <Link href={`/writings/${writing.slug}`} className={styles.postLink}>
      {card}
    </Link>
  );
}

export function WritingsList({ writings, allTags }: WritingsListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? writings.filter((w) => w.frontmatter.tags.includes(activeTag))
    : writings;

  return (
    <>
      <div className={styles.tagFilter} role="group" aria-label="Filter by tag">
        <span className={styles.filterLabel} aria-hidden="true">
          filter:
        </span>
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
        <p className={styles.empty}>// no writings matching this filter</p>
      ) : (
        <ul className={styles.postList}>
          {filtered.map((writing) => (
            <li key={writing.slug}>
              <WritingCard writing={writing} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
