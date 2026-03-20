import styles from "./GeoPattern.module.css";

interface GeoPatternProps {
  type: "dots" | "crosshatch" | "circuit" | "grid";
  className?: string;
}

const patternStyles: Record<GeoPatternProps["type"], string> = {
  dots: styles.dots,
  crosshatch: styles.crosshatch,
  circuit: styles.circuit,
  grid: styles.grid,
};

export function GeoPattern({ type, className }: GeoPatternProps) {
  return (
    <div
      className={`${styles.pattern} ${patternStyles[type]} ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
