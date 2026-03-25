import type { Slide } from "@/lib/presentations";
import styles from "./SlideRenderer.module.css";

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(__[^_]+__)/g);
  return parts.map((part, i) => {
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <strong key={i} className={styles.highlight}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

interface SlideRendererProps {
  slide: Slide;
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  switch (slide.type) {
    case "title":
      return (
        <div className={`${styles.slide} ${styles.titleSlide}`}>
          <h1 className={styles.titleMain}>{slide.title}</h1>
          {slide.subtitle && (
            <p className={styles.titleSub}>{slide.subtitle}</p>
          )}
          {(slide.author || slide.event) && (
            <div className={styles.titleMeta}>
              {slide.author && (
                <span className={styles.author}>{slide.author}</span>
              )}
              {slide.event && (
                <span className={styles.event}>{slide.event}</span>
              )}
              {slide.date && (
                <span className={styles.date}>{slide.date}</span>
              )}
            </div>
          )}
        </div>
      );

    case "section":
      return (
        <div className={`${styles.slide} ${styles.sectionSlide}`}>
          <h2 className={styles.sectionTitle}>{slide.title}</h2>
          {slide.subtitle && (
            <p className={styles.sectionSub}>{slide.subtitle}</p>
          )}
        </div>
      );

    case "content":
      return (
        <div className={`${styles.slide} ${styles.contentSlide}`}>
          <h2 className={styles.heading}>{renderInlineMarkdown(slide.title)}</h2>
          <div className={styles.body}>
            {slide.body.map((paragraph, i) => (
              <p key={i}>{renderInlineMarkdown(paragraph)}</p>
            ))}
          </div>
        </div>
      );

    case "bullets":
      return (
        <div className={`${styles.slide} ${styles.bulletsSlide}`}>
          <h2 className={styles.heading}>{slide.title}</h2>
          <ul className={styles.bulletList}>
            {slide.items.map((item, i) => (
              <li key={i} className={styles.bulletItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "code":
      return (
        <div className={`${styles.slide} ${styles.codeSlide}`}>
          <h2 className={styles.heading}>{slide.title}</h2>
          <div className={styles.codeWindow}>
            <div className={styles.codeBar}>
              <div className={styles.codeDots} aria-hidden="true">
                <span className={styles.codeDot} />
                <span className={styles.codeDot} />
                <span className={styles.codeDot} />
              </div>
              <span className={styles.codeLabel}>
                {slide.caption || "code.sh"}
              </span>
            </div>
            <pre className={styles.codeBlock}>
              <code>{slide.code}</code>
            </pre>
          </div>
          {slide.caption && (
            <p className={styles.caption}>{slide.caption}</p>
          )}
        </div>
      );

    case "image":
      return (
        <div className={`${styles.slide} ${styles.imageSlide}`}>
          <h2 className={styles.heading}>{slide.title}</h2>
          <div className={styles.imageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.src} alt={slide.alt} className={styles.image} />
          </div>
          {slide.caption && (
            <p className={styles.caption}>{slide.caption}</p>
          )}
        </div>
      );

    case "two-column":
      return (
        <div className={`${styles.slide} ${styles.twoColSlide}`}>
          <h2 className={styles.heading}>{slide.title}</h2>
          <div className={styles.columns}>
            <div className={styles.column}>
              {slide.left.map((item, i) => (
                <p key={i} className={i === 0 ? styles.colHeader : styles.colItem}>
                  {item}
                </p>
              ))}
            </div>
            <div className={styles.columnDivider} />
            <div className={styles.column}>
              {slide.right.map((item, i) => (
                <p key={i} className={i === 0 ? styles.colHeader : styles.colItem}>
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      );
  }
}
