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
    "Building tools that make enterprise architecture less painful — from AI agents that curate their own context, to static sites that generate interactive diagrams from Markdown, to prototyping pipelines you can fork and ship. On the side, exploring BCI, neuroscience, and cognitive state monitoring.",
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
        { name: "Enterprise Architecture", level: 95 },
        { name: "AI / LLM Engineering", level: 90 },
        { name: "Domain-Driven Design", level: 85 },
        { name: "Cloud Platforms (GCP/AWS/K8s)", level: 85 },
        { name: "Engineering Leadership", level: 85 },
      ],
    },
    {
      label: "Tools",
      icon: "/tool",
      items: [
        { name: "Claude Code / LLMs", level: 95 },
        { name: "tmux / Terminal", level: 90 },
        { name: "Kubernetes / Docker", level: 85 },
        { name: "MLflow / Python", level: 80 },
        { name: "DaVinci Resolve", level: 70 },
      ],
    },
    {
      label: "Hooks",
      icon: "/hook",
      items: [
        { name: "Neuroscience", level: 90 },
        { name: "Brain-Computer Interfaces", level: 85 },
        { name: "Cognitive Science", level: 85 },
        { name: "Generative AI Art", level: 80 },
        { name: "Cinematography", level: 70 },
      ],
    },
    {
      label: "Sub-Agents",
      icon: "/agent",
      items: [
        { name: "Academic Research", level: 85 },
        { name: "Technical Writing / Speaking", level: 85 },
        { name: "ML Model Training", level: 75 },
        { name: "Fiction Writing", level: 70 },
        { name: "3D / Visual Work", level: 60 },
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
