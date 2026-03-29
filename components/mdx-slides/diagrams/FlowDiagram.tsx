"use client";

import type { ReactNode } from "react";
import styles from "./Diagrams.module.css";

interface FlowBoxProps {
  children: ReactNode;
  accent?: boolean;
  success?: boolean;
  muted?: boolean;
  small?: boolean;
}

function FlowBox({ children, accent, success, muted, small }: FlowBoxProps) {
  const cls = [
    styles.flowBox,
    accent ? styles.flowBoxAccent : "",
    success ? styles.flowBoxSuccess : "",
    muted ? styles.flowBoxMuted : "",
    small ? styles.flowBoxSmall : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cls}>{children}</div>;
}

function FlowArrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <div
      className={
        direction === "down" ? styles.flowArrowDown : styles.flowArrowRight
      }
    >
      {direction === "down" ? "▼" : "▶"}
    </div>
  );
}

interface FlowRowProps {
  children: ReactNode;
}

function FlowRow({ children }: FlowRowProps) {
  return <div className={styles.flowRow}>{children}</div>;
}

function FlowColumn({ children }: { children: ReactNode }) {
  return <div className={styles.flowColumn}>{children}</div>;
}

export { FlowBox, FlowArrow, FlowRow, FlowColumn };
