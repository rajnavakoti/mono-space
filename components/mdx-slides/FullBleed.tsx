import type { CSSProperties, ReactNode } from "react";
import styles from "./MdxSlides.module.css";

interface FullBleedProps {
  children: ReactNode;
  background?: string;
}

export function FullBleed({ children, background }: FullBleedProps) {
  const style: CSSProperties = {};
  if (background) style.background = background;

  return (
    <div className={styles.fullBleed} style={style}>
      {children}
    </div>
  );
}
