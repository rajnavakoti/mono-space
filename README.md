# mono-space

Personal profile website for Raj Navakoti — portfolio, blog, and presentation platform.

Built with a neo-brutalist monochrome design system. No colors, no rounded corners, no shadows — just bold typography, heavy borders, and high contrast.

## Tech Stack

- **Framework:** Next.js 16 (App Router, static export)
- **Language:** TypeScript (strict mode)
- **Styling:** CSS Modules + CSS custom properties
- **Font:** JetBrains Mono (headings/code), system-ui (body)
- **Testing:** Jest + React Testing Library
- **Content:** MDX blog posts, JSON presentation slides

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, about, current focus, speaking, links |
| `/blog` | Blog listing with tag filtering |
| `/blog/[slug]` | Individual blog post (MDX rendered) |
| `/presentations` | Presentation listing |
| `/presentations/[slug]` | Presentation viewer with keyboard nav, fullscreen, swipe |

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build (static export)
npm run start     # Serve production build
npm run lint      # Run ESLint
npm test          # Run tests
```

## Content Authoring

### Blog Posts

Create an MDX file in `content/blog/`:

```mdx
---
title: "Your Post Title"
date: "2026-03-01"
tags: ["tag1", "tag2"]
excerpt: "A short description."
published: true
---

Your content here. Supports full MDX.
```

### Presentations

Create a JSON file in `content/presentations/`:

```json
{
  "title": "Talk Title",
  "event": "Conference Name",
  "date": "2026-06-15",
  "description": "What this talk is about.",
  "slides": [
    { "type": "title", "title": "Slide Title", "subtitle": "..." },
    { "type": "bullets", "title": "Key Points", "items": ["..."] },
    { "type": "code", "title": "Example", "language": "typescript", "code": "..." }
  ]
}
```

Slide types: `title`, `section`, `content`, `bullets`, `code`, `image`, `two-column`.

### Presentation Viewer Shortcuts

| Key | Action |
|-----|--------|
| Arrow keys | Navigate slides |
| Home / End | First / last slide |
| F / Enter | Toggle fullscreen |
| Escape | Exit fullscreen |
| N | Toggle speaker notes |

## Design System

Monochrome only: `#000`, `#FFF`, grays. All values via CSS custom properties in `styles/variables.css`. Dark mode default, light mode toggle in header.

## Deployment

Static export to Vercel. Auto-deploy on push to `main`, preview deployments on PRs.
