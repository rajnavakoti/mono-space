# mono-space — Requirements

Personal profile website for Raj Navakoti. Portfolio, blog, and presentation platform.
Built with neo-brutalist monochrome design. Deployable to Vercel (primary) and GCP (future).

---

## Pages

### 1. Home / About
- Hero section: name, title (Staff Software Engineer), one-liner tagline
- Brief about section: background, passions (AI, neuroscience, enterprise architecture, DDD)
- Links: GitHub, LinkedIn, Medium/Substack, email
- Current focus / what I'm working on (manually updated or pulled from a data file)
- Speaking engagements list (upcoming and past)

### 2. Blog
- List view: all posts, newest first
- Each post shows: title, date, reading time, tags, first 2 lines as excerpt
- Tag filtering (click a tag to filter)
- Individual post page: full MDX rendered content
- Blog posts stored as MDX files in /content/blog/
- Frontmatter: title, date, tags, excerpt, published (boolean)
- Code blocks with syntax highlighting (monochrome theme — no colored syntax)
- Reading time auto-calculated from word count

### 3. Presentations
- List view: all presentations with title, event name, date, description
- Individual presentation page: **full presentation viewer**
- Presentation content stored as structured files in /content/presentations/

#### Presentation Viewer (key feature)
- Slides rendered as full-viewport sections
- Navigation: arrow keys (left/right or up/down), click, swipe on mobile
- Slide counter: "3 / 15" indicator
- Keyboard shortcuts:
  - Arrow keys: navigate slides
  - F or Enter: toggle fullscreen
  - Escape: exit fullscreen
  - Home/End: first/last slide
- Each slide supports:
  - Title + body text
  - Code blocks (monochrome syntax highlighting)
  - Images (centered, max-width constrained)
  - Bullet lists
  - Two-column layouts
  - Speaker notes (hidden by default, toggle with 'N' key)
- Progress bar at bottom (thin, white line showing position)
- Mobile responsive: swipe navigation, readable text scaling
- Shareable: each presentation has its own URL, each slide can be deep-linked (/presentations/my-talk?slide=5)
- Export consideration: design slides so they could be screenshot/PDF'd cleanly

### 4. Projects (optional, lower priority)
- Grid of project cards
- Each card: name, one-line description, tech tags, link to GitHub repo
- Data from a JSON/YAML file in /content/projects/
- Only add this page if the first 3 pages are solid

---

## Design
- Be creative and bold. This should be an eye candy — visually striking, not just functional.
- Get inspired by popular neo-brutalist designs on the web. Push boundaries.
- Every page should feel intentional.
- Default to dark mode (black bg, white text). Support light mode toggle.

---

## Technical Requirements

### Performance
- Lighthouse score target: 95+ on all metrics
- Static generation for all pages (no SSR needed)
- Lazy load images below the fold
- Minimal JavaScript — only what's needed for presentation viewer and interactions

### SEO
- Meta tags on all pages (title, description, og:image)
- Structured data (JSON-LD) for blog posts
- Sitemap.xml auto-generated
- robots.txt

### Accessibility
- Keyboard navigable throughout
- Semantic HTML (nav, main, article, section)
- ARIA labels on interactive elements
- Skip-to-content link
- Color contrast: 4.5:1 minimum (easy with monochrome)
- Presentation viewer: fully keyboard accessible

### Mobile
- Responsive: 320px to 1440px+
- Mobile-first CSS
- Presentation viewer: touch/swipe navigation
- Readable without zooming

### Content Management
- Blog posts: MDX files with frontmatter
- Presentations: MDX or JSON slide definitions
- Projects: JSON/YAML data file
- No CMS, no database — all content is version controlled

---

## Deployment

### Phase 1: Local Development
- next dev for local development
- All features working locally before any deployment

### Phase 2: Vercel
- Connect GitHub repo to Vercel
- Auto-deploy on push to main
- Preview deployments on PRs
- Custom domain: rajnavakoti.dev (or similar, TBD)

### Phase 3: GCP (future, optional)
- Cloud Run or Firebase Hosting
- Infrastructure as code (Terraform or gcloud CLI)
- Only if needed for features Vercel can't handle

---

## Content Samples (for development)

Use these to build with real-ish content:

### Sample Blog Post
- Title: "Reverse-Engineering DDD: When the Code Knows More Than the Team"
- Tags: [DDD, architecture, engineering]
- Date: 2026-03-01
- 500 words of lorem ipsum structured as a real blog post (intro, 3 sections, conclusion)

### Sample Presentation
- Title: "Demand-Driven Context: A New Framework for Architecture Knowledge"
- Event: NDC 2026
- 8-10 slides covering: title slide, problem statement, approach, 3 content slides, demo slide, conclusion, Q&A

### Sample Projects
- architecture-catalog: "Visual architecture modeling toolkit" [Astro, React, TypeScript]
- ddc-framework: "Demand-Driven Context methodology and toolkit" [Python, Research]
- claude-code-view: "AI development dashboard" [Python, HTML]

---

## Development Roadmap (suggested issue breakdown)

### Milestone 1: Foundation
1. Initialize Next.js 15 project with TypeScript strict mode
2. Set up CSS custom properties and global styles (neo-brutalist theme)
3. Create root layout with navigation and footer
4. Build home/about page

### Milestone 2: Blog
5. Set up MDX processing pipeline
6. Build blog listing page
7. Build individual blog post page
8. Add tag filtering
9. Add sample blog posts

### Milestone 3: Presentations
10. Define presentation content format (slide schema)
11. Build presentation listing page
12. Build presentation viewer with keyboard navigation
13. Add fullscreen mode and progress bar
14. Add slide deep-linking
15. Add touch/swipe for mobile
16. Add speaker notes toggle
17. Add sample presentation

### Milestone 4: Polish
18. SEO: meta tags, JSON-LD, sitemap, robots.txt
19. Performance: Lighthouse audit and fixes
20. Accessibility audit and fixes
21. Dark/light mode toggle
22. README.md and documentation

### Milestone 5: Deploy
23. Deploy to Vercel
24. Custom domain setup
25. Preview deployment verification