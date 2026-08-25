"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./TerminalSnippet.module.css";

interface TerminalSnippetProps {
  lines: string[];
  className?: string;
}

export function TerminalSnippet({ lines, className }: TerminalSnippetProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (lines.length === 0) return;

    const cleanup = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    if (isPaused) {
      timerRef.current = setTimeout(() => {
        const nextLine = (currentLine + 1) % lines.length;
        if (nextLine === 0) {
          setDisplayedLines([]);
        }
        setCurrentLine(nextLine);
        setCurrentChar(0);
        setIsPaused(false);
      }, 1500);
      return cleanup;
    }

    const line = lines[currentLine];
    if (!line) return;

    if (currentChar < line.length) {
      timerRef.current = setTimeout(() => {
        const nextChar = currentChar + 1;
        setCurrentChar(nextChar);
        // Finish the line inside the timer chain. Doing it synchronously in
        // the effect body cascades an extra render on every completed line.
        if (nextChar === line.length) {
          setDisplayedLines((prev) => [...prev, line]);
          setIsPaused(true);
        }
      }, 50);
    } else {
      // Only reachable if `lines` changes mid-animation and leaves
      // currentChar past the end of the new line.
      timerRef.current = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, line]);
        setIsPaused(true);
      }, 0);
    }

    return cleanup;
  }, [currentLine, currentChar, isPaused, lines]);

  const activeLine = lines[currentLine] ?? "";
  const typedText = activeLine.slice(0, currentChar);

  return (
    <div
      className={`${styles.terminal} ${className ?? ""}`}
      aria-hidden="true"
    >
      {displayedLines.map((line, i) => (
        <div key={`${i}-${line}`} className={styles.line}>
          <span className={styles.prompt}>$</span>
          <span className={styles.text}>{line}</span>
        </div>
      ))}
      <div className={styles.line}>
        <span className={styles.prompt}>$</span>
        <span className={styles.text}>{typedText}</span>
        <span className={styles.cursor} />
      </div>
    </div>
  );
}
