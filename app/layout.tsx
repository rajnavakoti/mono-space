import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

// Inline no-flash theme script — runs synchronously on first paint to
// pick up the stored theme before React hydrates, preventing the brief
// light->dark flicker on dark-mode preferences. Kept as a raw string +
// dangerouslySetInnerHTML on a real <script> in <head> (the only way
// to guarantee blocking pre-hydration execution).
const themeScript = `(function(){var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();`;

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://rajnavakoti.com";

export const metadata: Metadata = {
  title: {
    default: "Raj Navakoti",
    template: "%s | Raj Navakoti",
  },
  description:
    "Staff Software Engineer - AI, neuroscience, enterprise architecture, DDD",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Raj Navakoti",
    title: "Raj Navakoti",
    description:
      "Staff Software Engineer - AI, neuroscience, enterprise architecture, DDD",
  },
  twitter: {
    card: "summary",
    title: "Raj Navakoti",
    description:
      "Staff Software Engineer - AI, neuroscience, enterprise architecture, DDD",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
