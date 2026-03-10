"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/navigation";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <Link href="/" className={styles.logo}>
            RAJ<span className={styles.logoAccent}>_</span>N
          </Link>
          <span className={styles.separator} aria-hidden="true">
            |
          </span>
          <span className={styles.status}>sys.online</span>
        </div>

        <div className={styles.toolbarRight}>
          <nav aria-label="Main navigation">
            <ul
              id="main-nav-links"
              className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}
              role="list"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${styles.link} ${
                      pathname === link.href ? styles.linkActive : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {pathname === link.href && (
                      <span className={styles.activeMarker} aria-hidden="true">
                        &gt;{" "}
                      </span>
                    )}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="main-nav-links"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "[X]" : "[=]"}
          </button>
        </div>
      </div>
    </header>
  );
}
