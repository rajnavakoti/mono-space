import { socialLinks } from "@/lib/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.links}>
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.link}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={
                link.href.startsWith("mailto:")
                  ? undefined
                  : "noopener noreferrer"
              }
            >
              {link.label}
            </a>
          ))}
        </div>
        <p className={styles.copyright}>
          {currentYear} Raj Navakoti
        </p>
      </div>
    </footer>
  );
}
