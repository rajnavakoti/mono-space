import styles from "./MdxSlides.module.css";

interface SlideImageProps {
  src: string;
  alt: string;
}

export function SlideImage({ src, alt }: SlideImageProps) {
  return (
    <div className={styles.slideImageWrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={styles.slideImage} />
    </div>
  );
}
