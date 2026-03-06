"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/navigation";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.logo}>
          RAJ<span className={styles.logoAccent}>_</span>N
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="main-nav-links"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "[X]" : "[=]"}
        </button>

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
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
