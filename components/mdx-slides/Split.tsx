import React from "react";
import styles from "./MdxSlides.module.css";

interface SplitProps {
  children: React.ReactNode;
  ratio?: "1:1" | "2:1" | "1:2" | "3:1" | "1:3";
}

const ratioClassMap: Record<string, string> = {
  "1:1": styles.split1x1,
  "2:1": styles.split2x1,
  "1:2": styles.split1x2,
  "3:1": styles.split3x1,
  "1:3": styles.split1x3,
};

export function Split({ children, ratio = "1:1" }: SplitProps) {
  const ratioClass = ratioClassMap[ratio] || styles.split1x1;

  return (
    <div className={`${styles.split} ${ratioClass}`}>
      {React.Children.map(children, (child) => (
        <div className={styles.splitPane}>{child}</div>
      ))}
    </div>
  );
}
