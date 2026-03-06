# mono-space

Raj's personal profile website — portfolio, blog, and presentation platform.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** CSS Modules + CSS custom properties
- **Font:** JetBrains Mono (code/headings), system-ui (body)
- **Deployment:** Local-first → Vercel → optionally GCP later

## Architecture Decisions
- Static site generation (SSG) for all pages — no server-side rendering needed
- Blog posts as MDX files in /content/blog/
- Presentations as MDX or structured JSON in /content/presentations/
- No CMS, no database — everything is files in the repo
- Images optimized via Next.js Image component
- Data and UI always decoupled — all display data from props, config files, or content files. Never hardcode data in components.

## UX & Design
- Be creative. This site should be an eye candy — not just functional but visually striking.
- Get inspired by popular neo-brutalist designs on the web. Push boundaries.
- Every page should feel intentional and bold.

## Workflow (Semi-Autonomous)
This project uses a semi-autonomous development workflow:

### GitHub Issues = Source of Truth
- ALL work must be tracked via GitHub Issues
- Before starting any work, create or update the relevant issue
- Every commit must reference an issue number
- When work is complete, update the issue and create a PR
- Never do work that isn't tracked in an issue

### Development Flow
1. Pick or create a GitHub Issue for the task
2. Create branch from main: feat/, fix/, chore/, docs/ prefix
3. Implement → test → commit (use /commit command)
4. Create PR (use /pr command) → notify human for review
5. Address review feedback → push updates
6. After approval → merge → move to next issue

### Rules
- Never commit to main directly
- One issue per branch, one concern per PR
- Every component must have a co-located test file
- Run tests before committing
- All tests must pass before creating PR

## Project Structure (target)
```
mono-space/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home / About
│   ├── blog/
│   │   ├── page.tsx        # Blog listing
│   │   └── [slug]/
│   │       └── page.tsx    # Individual blog post
│   └── presentations/
│       ├── page.tsx        # Presentations listing
│       └── [slug]/
│           └── page.tsx    # Presentation viewer
├── components/             # Reusable UI components
├── content/
│   ├── blog/               # MDX blog posts
│   └── presentations/      # Presentation content files
├── lib/                    # Utilities, helpers
├── public/                 # Static assets
├── styles/                 # Global styles, CSS variables
└── __tests__/              # Integration tests (unit tests co-located)
```

## Global Extensions Available
The following are already configured at user level (~/.claude/):
- /commit — semantic commits with auto-branching
- /pr — PR creation via gh CLI
- issue-manager agent — GitHub issue CRUD
- code-reviewer agent — code review
- Global rules auto-loaded for FE, TypeScript, and design conventions
