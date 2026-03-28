import type { ReactNode } from "react";
import styles from "./MdxSlides.module.css";

interface CalloutProps {
  children: ReactNode;
  type?: "info" | "warning" | "tip" | "quote";
}

const typeClassMap: Record<string, string> = {
  info: styles.calloutInfo,
  warning: styles.calloutWarning,
  tip: styles.calloutTip,
  quote: styles.calloutQuote,
};

const labelMap: Record<string, string> = {
  info: "// info",
  warning: "// warning",
  tip: "// tip",
  quote: "// quote",
};

export function Callout({ children, type = "info" }: CalloutProps) {
  const typeClass = typeClassMap[type] || styles.calloutInfo;

  return (
    <div className={`${styles.callout} ${typeClass}`}>
      <div className={styles.calloutLabel}>{labelMap[type] || "// note"}</div>
      <div>{children}</div>
    </div>
  );
}
