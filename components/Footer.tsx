import { socialLinks } from "@/lib/navigation";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.statusBar}>
        <div className={styles.left}>
          <span className={styles.label}>LINKS:</span>
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
        </div>
        <p className={styles.copyright}>
          &copy; {currentYear} raj_navakoti
        </p>
      </div>
    </footer>
  );
}
