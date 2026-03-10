import { profile } from "@/content/profile";
import styles from "./page.module.css";

export default function Home() {
  const upcoming = profile.speaking.filter((s) => s.upcoming);
  const past = profile.speaking.filter((s) => !s.upcoming);

  return (
    <div className={styles.page}>
      {/* Hero — terminal style */}
      <section className={styles.hero}>
        <div className={styles.terminal}>
          <div className={styles.terminalBar}>
            <span className={styles.terminalDot} aria-hidden="true" />
            <span className={styles.terminalDot} aria-hidden="true" />
            <span className={styles.terminalDot} aria-hidden="true" />
            <span className={styles.terminalTitle}>~/raj</span>
          </div>
          <div className={styles.terminalBody}>
            <p className={styles.prompt}>
              <span className={styles.promptSymbol} aria-hidden="true">
                $
              </span>{" "}
              whoami
            </p>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.title}>{profile.title}</p>
            <p className={styles.tagline}>{profile.tagline}</p>
            <p className={styles.cursor} aria-hidden="true">
              <span className={styles.promptSymbol}>$</span>{" "}
              <span className={styles.blink}>_</span>
            </p>
          </div>
        </div>
      </section>

      {/* About — window panel */}
      <section aria-labelledby="about-heading">
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.windowLabel} id="about-heading">
              ABOUT.md
            </span>
            <span className={styles.windowControls} aria-hidden="true">
              [&minus;] [&square;] [&times;]
            </span>
          </div>
          <div className={styles.windowBody}>
            <p className={styles.aboutText}>{profile.about}</p>
          </div>
        </div>
      </section>

      {/* Focus — window panel */}
      <section aria-labelledby="focus-heading">
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.windowLabel} id="focus-heading">
              FOCUS.log
            </span>
            <span className={styles.windowControls} aria-hidden="true">
              [&minus;] [&square;] [&times;]
            </span>
          </div>
          <div className={styles.windowBody}>
            <ul className={styles.focusList}>
              {profile.currentFocus.map((item) => (
                <li key={item} className={styles.focusItem}>
                  <span className={styles.focusBullet} aria-hidden="true">
                    &gt;
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Speaking — window panel */}
      <section aria-labelledby="speaking-heading">
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.windowLabel} id="speaking-heading">
              TALKS.json
            </span>
            <span className={styles.windowControls} aria-hidden="true">
              [&minus;] [&square;] [&times;]
            </span>
          </div>
          <div className={styles.windowBody}>
            {upcoming.length > 0 && (
              <div className={styles.talkGroup}>
                <p className={styles.talkGroupLabel}>// upcoming</p>
                {upcoming.map((talk) => (
                  <article key={talk.title} className={styles.talkCard}>
                    <p className={styles.talkTitle}>{talk.title}</p>
                    <p className={styles.talkMeta}>
                      {talk.event} &mdash; {talk.date}
                    </p>
                  </article>
                ))}
              </div>
            )}
            {past.length > 0 && (
              <div className={styles.talkGroup}>
                <p className={styles.talkGroupLabel}>// past</p>
                {past.map((talk) => (
                  <article key={talk.title} className={styles.talkCard}>
                    <p className={styles.talkTitle}>{talk.title}</p>
                    <p className={styles.talkMeta}>
                      {talk.event} &mdash; {talk.date}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Connect — window panel */}
      <section aria-labelledby="connect-heading">
        <div className={styles.window}>
          <div className={styles.windowBar}>
            <span className={styles.windowLabel} id="connect-heading">
              LINKS.sh
            </span>
            <span className={styles.windowControls} aria-hidden="true">
              [&minus;] [&square;] [&times;]
            </span>
          </div>
          <div className={styles.windowBody}>
            <div className={styles.linkGrid}>
              {profile.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={styles.connectLink}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                  {link.external && (
                    <span aria-hidden="true"> &rarr;</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
