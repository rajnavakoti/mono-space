import type { ReactNode } from "react";
import styles from "./MdxSlides.module.css";

interface CodeBlockProps {
  children?: ReactNode;
  code?: string;
  title?: string;
  highlight?: string;
}

function parseHighlightLines(highlight: string): Set<number> {
  const lines = new Set<number>();
  for (const part of highlight.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [start, end] = trimmed.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        lines.add(i);
      }
    } else {
      lines.add(Number(trimmed));
    }
  }
  return lines;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    const element = node as { props: { children?: ReactNode } };
    return extractText(element.props.children);
  }
  return "";
}

export function CodeBlock({
  children,
  code,
  title,
  highlight,
}: CodeBlockProps) {
  const text = code || extractText(children);
  const highlightLines = highlight ? parseHighlightLines(highlight) : null;
  const codeLines = text.trimEnd().split("\n");

  return (
    <div className={styles.codeWindow}>
      <div className={styles.codeBar}>
        <div className={styles.codeDots} aria-hidden="true">
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
          <span className={styles.codeDot} />
        </div>
        <span className={styles.codeLabel}>{title || "code"}</span>
      </div>
      <div className={styles.codeContent}>
        {highlightLines
          ? codeLines.map((line, i) => (
              <span
                key={i}
                className={
                  highlightLines.has(i + 1)
                    ? styles.codeHighlightLine
                    : undefined
                }
              >
                {line}
                {"\n"}
              </span>
            ))
          : text.trimEnd()}
      </div>
    </div>
  );
}
