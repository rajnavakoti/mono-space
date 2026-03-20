"use client";

import { useEffect, useRef } from "react";
import styles from "./DotMatrix.module.css";

interface DotMatrixProps {
  className?: string;
}

export function DotMatrix({ className }: DotMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const spacing = 20;
    const baseRadius = 1;
    const baseOpacity = 0.1;

    const computedStyle = getComputedStyle(canvas);
    const accentColor = computedStyle.getPropertyValue("--color-accent").trim() || "#C9A96E";

    // Parse hex to RGB
    const hexToRgb = (hex: string): [number, number, number] => {
      const clean = hex.replace("#", "");
      return [
        parseInt(clean.substring(0, 2), 16),
        parseInt(clean.substring(2, 4), 16),
        parseInt(clean.substring(4, 6), 16),
      ];
    };

    const [r, g, b] = hexToRgb(accentColor);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    }

    const draw = (time: number) => {
      const parentEl = canvas.parentElement;
      if (!parentEl) return;

      const rect = parentEl.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      const t = time * 0.001;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacing + spacing * 0.5;
          const y = row * spacing + spacing * 0.5;

          const wave =
            Math.sin(x * 0.02 + t * 0.8) *
            Math.cos(y * 0.02 + t * 0.6) *
            0.5 + 0.5;

          const opacity = baseOpacity + wave * 0.05;

          ctx.beginPath();
          ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.canvas} ${className ?? ""}`}
      aria-hidden="true"
    />
  );
}
