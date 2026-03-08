import { profile } from "@/content/profile";
import styles from "./page.module.css";

export default function Home() {
  const upcoming = profile.speaking.filter((s) => s.upcoming);
  const past = profile.speaking.filter((s) => !s.upcoming);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.greeting}>Hello, I&apos;m</p>
        <h1 className={styles.name}>{profile.name}</h1>
        <p className={styles.title}>{profile.title}</p>
        <p className={styles.tagline}>{profile.tagline}</p>
      </section>

      <section className={styles.section} aria-labelledby="about-heading">
        <h2 id="about-heading" className={styles.sectionTitle}>
          // about
        </h2>
        <div className={styles.aboutContent}>
          {profile.about.map((paragraph, i) => (
            <p key={i} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="focus-heading">
        <h2 id="focus-heading" className={styles.sectionTitle}>
          // current focus
        </h2>
        <ul className={styles.focusList}>
          {profile.currentFocus.map((item) => (
            <li key={item} className={styles.focusItem}>
              <span className={styles.bullet} aria-hidden="true">
                &gt;
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="speaking-heading">
        <h2 id="speaking-heading" className={styles.sectionTitle}>
          // speaking
        </h2>

        {upcoming.length > 0 && (
          <div className={styles.speakingGroup}>
            <h3 className={styles.speakingLabel}>Upcoming</h3>
            <div className={styles.engagements}>
              {upcoming.map((talk) => (
                <article key={talk.title} className={styles.talkCard}>
                  <p className={styles.talkTitle}>{talk.title}</p>
                  <p className={styles.talkMeta}>
                    {talk.event} &mdash; {talk.date}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div className={styles.speakingGroup}>
            <h3 className={styles.speakingLabel}>Past</h3>
            <div className={styles.engagements}>
              {past.map((talk) => (
                <article key={talk.title} className={styles.talkCard}>
                  <p className={styles.talkTitle}>{talk.title}</p>
                  <p className={styles.talkMeta}>
                    {talk.event} &mdash; {talk.date}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className={styles.section} aria-labelledby="links-heading">
        <h2 id="links-heading" className={styles.sectionTitle}>
          // connect
        </h2>
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
                <span className={styles.arrow} aria-hidden="true">
                  {" "}
                  &rarr;
                </span>
              )}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
