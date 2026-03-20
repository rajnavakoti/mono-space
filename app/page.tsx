import Image from "next/image";
import { profile } from "@/content/profile";
import { TypingEffect } from "@/components/TypingEffect";
import { PixelCharacter } from "@/components/PixelCharacter";
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
            <div className={styles.terminalDots} aria-hidden="true">
              <span className={styles.terminalDot} />
              <span className={styles.terminalDot} />
              <span className={styles.terminalDot} />
            </div>
            <span className={styles.terminalTitle}>raj@mono-space:~</span>
            <span className={styles.terminalPid} aria-hidden="true">
              PID 1337
            </span>
          </div>
          <div className={styles.terminalBody}>
            <div className={styles.promptLine}>
              <span className={styles.promptSymbol} aria-hidden="true">
                $
              </span>
              <TypingEffect text=" whoami" className={styles.promptText} />
            </div>
            <div className={styles.output}>
              <div className={styles.heroContent}>
                <div className={styles.heroText}>
                  <h1 className={styles.name}>{profile.name}</h1>
                  <p className={styles.title}>{profile.title}</p>
                  <div className={styles.taglineWrap}>
                    <span className={styles.taglineBracket} aria-hidden="true">
                      [
                    </span>
                    <p className={styles.tagline}>{profile.tagline}</p>
                    <span className={styles.taglineBracket} aria-hidden="true">
                      ]
                    </span>
                  </div>
                </div>
                <div className={styles.photoFrame}>
                  <div className={styles.photoWindow}>
                    <div className={styles.photoBar}>
                      <span className={styles.photoDots} aria-hidden="true">
                        <span className={styles.photoDot} />
                        <span className={styles.photoDot} />
                        <span className={styles.photoDot} />
                      </span>
                      <span className={styles.photoLabel}>profile.jpeg</span>
                    </div>
                    <Image
                      src="/profile.jpeg"
                      alt="Raj Navakoti"
                      width={180}
                      height={220}
                      className={styles.photo}
                      unoptimized
                      priority
                    />
                  </div>
                  <p className={styles.quote}>&ldquo;{profile.quote}&rdquo;</p>
                </div>
              </div>
            </div>
            <div className={styles.promptLine}>
              <span className={styles.promptSymbol} aria-hidden="true">
                $
              </span>
              <span className={styles.blink} aria-hidden="true">
                _
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ASCII divider */}
      <div className={styles.divider} aria-hidden="true">
        ========================================
      </div>

      {/* About */}
      <section aria-labelledby="about-heading" className="fade-in fade-in-1">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} id="about-heading">
            ABOUT.md
          </span>
          <span className={styles.sectionControls} aria-hidden="true">
            [&minus;] [&square;] [&times;]
          </span>
        </div>
        <div className={styles.sectionBody}>
          <p className={styles.aboutText}>{profile.about}</p>
          <PixelCharacter type="reader" className={styles.pixelBottomRight} />
        </div>
      </section>

      {/* Focus */}
      <section aria-labelledby="focus-heading" className="fade-in fade-in-2">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} id="focus-heading">
            FOCUS.log
          </span>
          <span className={styles.sectionControls} aria-hidden="true">
            [&minus;] [&square;] [&times;]
          </span>
        </div>
        <div className={styles.sectionBody}>
          <ul className={styles.focusList}>
            {profile.currentFocus.map((item, i) => (
              <li key={item} className={styles.focusItem}>
                <span className={styles.focusIndex} aria-hidden="true">
                  {String(i).padStart(2, "0")}
                </span>
                <span className={styles.focusBullet} aria-hidden="true">
                  //
                </span>
                {item}
              </li>
            ))}
          </ul>
          <PixelCharacter type="coder" className={styles.pixelBottomLeft} />
        </div>
      </section>

      {/* Speaking */}
      <section aria-labelledby="speaking-heading" className="fade-in fade-in-3">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} id="speaking-heading">
            TALKS.json
          </span>
          <span className={styles.sectionControls} aria-hidden="true">
            [&minus;] [&square;] [&times;]
          </span>
        </div>
        <div className={styles.sectionBody}>
          {upcoming.length > 0 && (
            <div className={styles.talkGroup}>
              <p className={styles.talkGroupLabel}>
                <span aria-hidden="true">&#9654; </span>upcoming
              </p>
              {upcoming.map((talk) => (
                <article key={talk.title} className={styles.talkCard}>
                  <div className={styles.talkHeader}>
                    <p className={styles.talkTitle}>{talk.title}</p>
                    <span className={styles.talkBadge}>NEXT</span>
                  </div>
                  <p className={styles.talkMeta}>
                    {talk.event} &mdash; {talk.date}
                  </p>
                </article>
              ))}
            </div>
          )}
          {past.length > 0 && (
            <div className={styles.talkGroup}>
              <p className={styles.talkGroupLabel}>
                <span aria-hidden="true">&#9632; </span>past
              </p>
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
          <PixelCharacter type="speaker" className={styles.pixelBottomRight} />
        </div>
      </section>

      {/* Connect */}
      <section aria-labelledby="connect-heading" className="fade-in fade-in-4">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} id="connect-heading">
            LINKS.sh
          </span>
          <span className={styles.sectionControls} aria-hidden="true">
            [&minus;] [&square;] [&times;]
          </span>
        </div>
        <div className={styles.sectionBody}>
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
          <PixelCharacter type="waver" className={styles.pixelBottomLeft} />
        </div>
      </section>

      {/* Footer divider */}
      <div className={styles.divider} aria-hidden="true">
        ========================================
      </div>
    </div>
  );
}
