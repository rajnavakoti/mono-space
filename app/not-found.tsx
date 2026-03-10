import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.terminal}>
        <div className={styles.terminalBar}>
          <div className={styles.terminalDots} aria-hidden="true">
            <span className={styles.terminalDot} />
            <span className={styles.terminalDot} />
            <span className={styles.terminalDot} />
          </div>
          <span className={styles.terminalTitle}>bash — error</span>
        </div>
        <div className={styles.terminalBody}>
          <p className={styles.line}>
            <span className={styles.prompt}>$</span> cd /requested-page
          </p>
          <p className={styles.error}>
            bash: cd: /requested-page: No such file or directory
          </p>
          <p className={styles.line}>
            <span className={styles.prompt}>$</span> echo $?
          </p>
          <p className={styles.errorCode}>404</p>
          <p className={styles.line}>
            <span className={styles.prompt}>$</span> cat error.log
          </p>
          <p className={styles.message}>
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className={styles.actions}>
            <p className={styles.line}>
              <span className={styles.prompt}>$</span> _
            </p>
            <div className={styles.links}>
              <Link href="/" className={styles.link}>
                cd ~
              </Link>
              <Link href="/blog" className={styles.link}>
                cd ~/blog
              </Link>
              <Link href="/presentations" className={styles.link}>
                cd ~/talks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
