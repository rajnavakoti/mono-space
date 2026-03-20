export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Writings", href: "/writings" },
  { label: "Presentations", href: "/presentations" },
];

export interface SocialLink {
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/rajnavakoti" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rajnavakoti" },
  { label: "Email", href: "mailto:rajnavakoti@gmail.com" },
];
