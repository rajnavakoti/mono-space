import Image from "next/image";
import { profile } from "@/content/profile";
import { TypingEffect } from "@/components/TypingEffect";
import { SvgIllustration } from "@/components/SvgIllustration";
import { TerminalSnippet } from "@/components/TerminalSnippet";
import { GeoPattern } from "@/components/GeoPattern";
import { DotMatrix } from "@/components/DotMatrix";
import { SkillsChart } from "@/components/SkillsChart";
import styles from "./page.module.css";

export default function Home() {
  const upcoming = profile.speaking.filter((s) => s.upcoming);
  const past = profile.speaking.filter((s) => !s.upcoming);

  return (
    <div className={styles.page}>
      {/* Hero — terminal style with DotMatrix background */}
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
            <DotMatrix />
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

      {/* About — with SVG illustration */}
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
          <div className={styles.sectionWithVisual}>
            <p className={styles.aboutText}>{profile.about}</p>
            <SvgIllustration type="blueprint" />
          </div>
        </div>
      </section>

      {/* Focus — with terminal snippet */}
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
          <div className={styles.sectionWithVisual}>
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
            <TerminalSnippet
              lines={[
                "npm run architect",
                "loading context...",
                "demand-driven: active",
                "AI augmentation: on",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Skills — agent extensions style pie charts */}
      <section aria-labelledby="skills-heading" className="fade-in fade-in-3">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} id="skills-heading">
            SKILLS.config
          </span>
          <span className={styles.sectionControls} aria-hidden="true">
            [&minus;] [&square;] [&times;]
          </span>
        </div>
        <div className={styles.sectionBody}>
          <SkillsChart groups={profile.skills} />
        </div>
      </section>

      {/* Speaking — with geo pattern background */}
      <section aria-labelledby="speaking-heading" className="fade-in fade-in-4">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} id="speaking-heading">
            TALKS.json
          </span>
          <span className={styles.sectionControls} aria-hidden="true">
            [&minus;] [&square;] [&times;]
          </span>
        </div>
        <div className={styles.sectionBody}>
          <GeoPattern type="dots" />
          {upcoming.length > 0 && (
            <div className={styles.talkGroup}>
              <p className={styles.talkGroupLabel}>
                <span aria-hidden="true">&#9654; </span>upcoming
              </p>
              {upcoming.map((talk) => (
                <article key={talk.title} className={styles.talkCard}>
                  {talk.logo && (
                    <Image
                      src={talk.logo}
                      alt={`${talk.event} logo`}
                      width={40}
                      height={40}
                      className={styles.talkLogo}
                      unoptimized
                    />
                  )}
                  <div className={styles.talkContent}>
                    <div className={styles.talkHeader}>
                      <p className={styles.talkTitle}>{talk.title}</p>
                      <span className={styles.talkBadge}>NEXT</span>
                    </div>
                    <p className={styles.talkMeta}>
                      {talk.event} &mdash; {talk.location} &mdash; {talk.date}
                    </p>
                  </div>
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
                  {talk.logo && (
                    <Image
                      src={talk.logo}
                      alt={`${talk.event} logo`}
                      width={40}
                      height={40}
                      className={styles.talkLogo}
                      unoptimized
                    />
                  )}
                  <div className={styles.talkContent}>
                    <p className={styles.talkTitle}>{talk.title}</p>
                    <p className={styles.talkMeta}>
                      {talk.event} &mdash; {talk.location} &mdash; {talk.date}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Connect — with network illustration */}
      <section aria-labelledby="connect-heading" className="fade-in fade-in-5">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionLabel} id="connect-heading">
            LINKS.sh
          </span>
          <span className={styles.sectionControls} aria-hidden="true">
            [&minus;] [&square;] [&times;]
          </span>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.sectionWithVisual}>
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
            <SvgIllustration type="network" />
          </div>
        </div>
      </section>

      {/* Footer divider */}
      <div className={styles.divider} aria-hidden="true">
        ========================================
      </div>
    </div>
  );
}
