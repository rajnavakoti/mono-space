import styles from "./MdxSlides.module.css";

interface VideoProps {
  src: string;
  title?: string;
  autoplay?: boolean;
}

function isEmbedUrl(src: string): boolean {
  return (
    src.includes("youtube.com/embed") ||
    src.includes("player.vimeo.com") ||
    src.includes("youtube-nocookie.com/embed")
  );
}

export function Video({ src, title, autoplay = false }: VideoProps) {
  const isEmbed = isEmbedUrl(src);

  return (
    <div className={styles.videoWrapper}>
      {isEmbed ? (
        <iframe
          className={styles.videoIframe}
          src={`${src}${autoplay ? "?autoplay=1" : ""}`}
          title={title || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video
          className={styles.videoNative}
          src={src}
          controls
          autoPlay={autoplay}
          playsInline
        >
          <track kind="captions" />
        </video>
      )}
      {title && <p className={styles.videoTitle}>{title}</p>}
    </div>
  );
}
