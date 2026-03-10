"use client";

import styles from "./PixelCharacter.module.css";

type CharacterType = "reader" | "coder" | "speaker" | "waver";

interface PixelCharacterProps {
  type: CharacterType;
  className?: string;
}

export function PixelCharacter({ type, className }: PixelCharacterProps) {
  return (
    <div
      className={`${styles.wrapper} ${styles[type]} ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className={styles.character}>
        <div className={styles.sprite} />
      </div>
    </div>
  );
}
