import type { ReactNode } from "react";
import styles from "./MdxSlides.module.css";

interface CalloutProps {
  children: ReactNode;
  type?: "info" | "warning" | "tip" | "quote" | "danger";
  /**
   * Optional custom label text shown in the "// label" header. Defaults to
   * the type name. Use this when the slide needs a domain-specific label like
   * "DEAD BOUNDARY" or "VALIDATE" rather than the generic type word.
   */
  label?: string;
}

const typeClassMap: Record<string, string> = {
  info: styles.calloutInfo,
  warning: styles.calloutWarning,
  tip: styles.calloutTip,
  quote: styles.calloutQuote,
  danger: styles.calloutDanger,
};

const defaultLabelMap: Record<string, string> = {
  info: "info",
  warning: "warning",
  tip: "tip",
  quote: "quote",
  danger: "danger",
};

export function Callout({ children, type = "info", label }: CalloutProps) {
  const typeClass = typeClassMap[type] || styles.calloutInfo;
  const labelText = label ?? defaultLabelMap[type] ?? "note";

  return (
    <div className={`${styles.callout} ${typeClass}`}>
      <div className={styles.calloutLabel}>{`// ${labelText.toLowerCase()}`}</div>
      <div>{children}</div>
    </div>
  );
}
