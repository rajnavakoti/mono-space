"use client";

import { useState, useEffect } from "react";
import styles from "./TypingEffect.module.css";

interface TypingEffectProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TypingEffect({ text, className, delay = 0 }: TypingEffectProps) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 50 + Math.random() * 30);

    return () => clearTimeout(timer);
  }, [displayed, text, started]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span className={styles.typingCursor} aria-hidden="true">
          _
        </span>
      )}
    </span>
  );
}
