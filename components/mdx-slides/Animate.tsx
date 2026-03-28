"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./MdxSlides.module.css";

interface AnimateProps {
  children: ReactNode;
  type?: "fade-in" | "slide-up" | "slide-left" | "scale" | "typewriter";
  delay?: string;
  duration?: string;
}

const typeClassMap: Record<string, string> = {
  "fade-in": styles.animateFadeIn,
  "slide-up": styles.animateSlideUp,
  "slide-left": styles.animateSlideLeft,
  scale: styles.animateScale,
  typewriter: styles.animateTypewriter,
};

export function Animate({
  children,
  type = "fade-in",
  delay,
  duration,
}: AnimateProps) {
  const className = typeClassMap[type] || styles.animateFadeIn;

  const style = {
    ...(delay ? { "--animate-delay": delay } : {}),
    ...(duration ? { "--animate-duration": duration } : {}),
  } as CSSProperties;

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
