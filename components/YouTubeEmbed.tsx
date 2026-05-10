"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./YouTubeEmbed.module.css";

export interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  caption?: string;
}

export function YouTubeEmbed({ videoId, title, caption }: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;

  if (loaded) {
    return (
      <figure className={styles.figure}>
        <div className={styles.frame}>
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.iframe}
          />
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className={styles.figure}>
      <button
        type="button"
        className={styles.button}
        onClick={() => setLoaded(true)}
        aria-label={`Play video: ${title}`}
      >
        <span className={styles.frame}>
          <Image
            src={thumbnail}
            alt=""
            fill
            className={styles.thumbnail}
            unoptimized
            priority={false}
          />
          <span className={styles.overlay} aria-hidden="true" />
          <span className={styles.playBadge} aria-hidden="true">
            <svg viewBox="0 0 68 48" width="68" height="48" focusable="false">
              <path
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                fill="currentColor"
              />
              <path d="M45 24L27 14v20" fill="var(--color-bg)" />
            </svg>
          </span>
          <span className={styles.titleBar}>
            <span className={styles.titleLabel}>WATCH</span>
            <span className={styles.titleText}>{title}</span>
          </span>
        </span>
      </button>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
