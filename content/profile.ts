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
  currentFocus: { name: string; description: string; url: string }[];
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
  location: string;
  upcoming: boolean;
  url?: string;
  logo?: string;
  photo?: string;
}

export const profile: Profile = {
  name: "Raj Navakoti",
  title: "Staff Software Engineer",
  tagline: "AI . Architecture . Cognition",
  quote: "The best architectures emerge from understanding how humans think, not just how machines compute.",
  about:
    "I design systems at the intersection of software architecture, AI, and how humans actually think. Currently deep into demand-driven design and LLM-augmented engineering.",
  currentFocus: [
    {
      name: "DDC Framework",
      description: "TDD-style methodology for building AI agent knowledge bases",
      url: "https://github.com/ea-toolkit/ddc",
    },
    {
      name: "Architecture Catalog",
      description: "Markdown-to-interactive-diagrams for enterprise architecture",
      url: "https://github.com/ea-toolkit/architecture-catalog",
    },
    {
      name: "Prototype-Ops",
      description: "Forkable template for enterprise prototyping pipelines",
      url: "https://github.com/ea-toolkit/prototype-ops",
    },
    {
      name: "Neuro State Monitor",
      description: "Real-time cognitive state tracking via EEG signals",
      url: "https://github.com/neural-state-lab/neuro-state-monitor",
    },
  ],
  skills: [
    {
      label: "Skills",
      icon: "/skill",
      items: [
        { name: "System Architecture", level: 95 },
        { name: "AI Engineering", level: 90 },
        { name: "Video Editing", level: 75 },
        { name: "Fictional Writing", level: 70 },
        { name: "Robotics", level: 60 },
      ],
    },
    {
      label: "Sub-Agents",
      icon: "/agent",
      items: [
        { name: "The Architect", level: 95 },
        { name: "The Storyteller", level: 80 },
        { name: "The Tinkerer", level: 70 },
        { name: "The Editor", level: 75 },
        { name: "The Explorer", level: 85 },
      ],
    },
    {
      label: "Hooks",
      icon: "/hook",
      items: [
        { name: "Brain-Computer Interfaces", level: 90 },
        { name: "Neuroscience", level: 85 },
        { name: "Cinematography", level: 70 },
        { name: "Generative AI Art", level: 80 },
        { name: "Cognitive Science", level: 85 },
      ],
    },
    {
      label: "Tools",
      icon: "/tool",
      items: [
        { name: "Claude / LLMs", level: 95 },
        { name: "DaVinci Resolve", level: 70 },
        { name: "Blender", level: 55 },
        { name: "Arduino / RPi", level: 65 },
        { name: "Obsidian", level: 90 },
      ],
    },
  ],
  links: [
    { label: "GitHub", href: "https://github.com/rajnavakoti", external: true },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/raj-navakoti-529880b1/",
      external: true,
    },
    { label: "Email", href: "mailto:rajnavakoti@gmail.com" },
  ],
  speaking: [
    {
      title: "Enterprise Context Management",
      event: "Create With",
      date: "2026-06-25",
      location: "Brighton, UK",
      upcoming: true,
      url: "https://www.createwith.com/",
      logo: "/talks/create-with-logo.png",
    },
    {
      title: "Reverse-Engineering Domain-Driven Architecture",
      event: "DDD Europe",
      date: "2026-06-09",
      location: "Antwerp, Belgium",
      upcoming: true,
      url: "https://2026.dddeurope.com/",
      logo: "/talks/ddd-europe-logo.jpeg",
    },
    {
      title: "Demand-Driven Context",
      event: "AI.engineer",
      date: "2026-04-08",
      location: "London, UK",
      upcoming: true,
      url: "https://www.ai.engineer/europe#speakers",
      logo: "/talks/ai-engineer-logo.jpg",
    },
    {
      title: "Enterprise Agentic Context",
      event: "AI Builders Amsterdam",
      date: "2026-02-26",
      location: "Amsterdam, NL",
      upcoming: false,
      url: "/presentations/ai-builders-ddc",
      logo: "/talks/ai-builders-logo.jpeg",
    },
  ],
};
