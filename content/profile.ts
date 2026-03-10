export interface Profile {
  name: string;
  title: string;
  tagline: string;
  about: string;
  currentFocus: string[];
  links: ProfileLink[];
  speaking: SpeakingEngagement[];
}

export interface ProfileLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface SpeakingEngagement {
  title: string;
  event: string;
  date: string;
  upcoming: boolean;
  url?: string;
}

export const profile: Profile = {
  name: "Raj Navakoti",
  title: "Staff Software Engineer",
  tagline: "AI . Architecture . Cognition",
  about:
    "I design systems at the intersection of software architecture, AI, and how humans actually think. Currently deep into demand-driven design and LLM-augmented engineering.",
  currentFocus: [
    "Demand-Driven Context framework",
    "AI-augmented dev workflows",
    "Enterprise DDD at scale",
    "Neuroscience x system design",
  ],
  links: [
    { label: "GitHub", href: "https://github.com/rajnavakoti", external: true },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/rajnavakoti",
      external: true,
    },
    { label: "Email", href: "mailto:rajnavakoti@gmail.com" },
  ],
  speaking: [
    {
      title: "Demand-Driven Context: A New Framework for Architecture Knowledge",
      event: "NDC 2026",
      date: "2026-06-15",
      upcoming: true,
    },
    {
      title: "Reverse-Engineering DDD in Legacy Systems",
      event: "DDD Europe 2026",
      date: "2026-02-10",
      upcoming: false,
    },
    {
      title: "AI-Augmented Architecture Decision Records",
      event: "GOTO Copenhagen 2025",
      date: "2025-11-20",
      upcoming: false,
    },
  ],
};
