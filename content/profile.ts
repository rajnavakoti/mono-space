export interface SkillGroup {
  label: string;
  icon: string;
  items: { name: string; level: number }[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  quote: string;
  about: string;
  currentFocus: string[];
  skills: SkillGroup[];
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
  quote: "The best architectures emerge from understanding how humans think, not just how machines compute.",
  about:
    "I design systems at the intersection of software architecture, AI, and how humans actually think. Currently deep into demand-driven design and LLM-augmented engineering.",
  currentFocus: [
    "Demand-Driven Context framework",
    "AI-augmented dev workflows",
    "Enterprise DDD at scale",
    "Neuroscience x system design",
  ],
  skills: [
    {
      label: "Skills",
      icon: "/skill",
      items: [
        { name: "TypeScript", level: 95 },
        { name: "System Design", level: 90 },
        { name: "Python", level: 80 },
        { name: "React/Next.js", level: 85 },
        { name: "DDD", level: 90 },
      ],
    },
    {
      label: "Tools",
      icon: "/tool",
      items: [
        { name: "AWS/GCP", level: 85 },
        { name: "Docker/K8s", level: 75 },
        { name: "CI/CD", level: 80 },
        { name: "PostgreSQL", level: 80 },
        { name: "LLM APIs", level: 90 },
      ],
    },
    {
      label: "Agents",
      icon: "/agent",
      items: [
        { name: "Architecture", level: 95 },
        { name: "AI/ML Integration", level: 85 },
        { name: "Team Leadership", level: 90 },
        { name: "Technical Writing", level: 80 },
        { name: "Mentoring", level: 85 },
      ],
    },
    {
      label: "Hooks",
      icon: "/hook",
      items: [
        { name: "Code Review", level: 90 },
        { name: "Perf Optimization", level: 80 },
        { name: "Security", level: 75 },
        { name: "Observability", level: 85 },
        { name: "Testing", level: 85 },
      ],
    },
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
