# Jacob C. Smith Portfolio

## Project Overview
Public-facing professional site and blog for Jacob C. Smith — industrial systems engineer and AI systems builder based in Buckhannon, West Virginia. Currently shipping industrial tooling for Readyfuels (WVRTP facility inspection system), agent infrastructure for Nous Research (Hermes plugin), and his own agent / MCP stack (JCLAW, MCPStarfleetCommand). Embedded / edge work on ESP32-S3 and UNIHIKER K10/M10. NewForce Cohort 11 graduate. Audience: prospective clients/consulting prospects, hiring managers (open to remote Data Analyst / BI / Jr Data Engineer roles at $70K+), technical peers, and the general public.

The aesthetic balances editorial warmth (Fraunces serif headings, crimson italic accents) with a measured monospace voice (JetBrains Mono eyebrows, terminal-flavored details). Clean light/dark themes, no loud terminal noise, particles are subtle and skipped on small screens / reduced-motion users.

## Tech Stack
- **Framework:** React 19 + React Router 7
- **Build Tool:** Vite 8
- **Languages:** JavaScript (ESM), JSX, CSS, Markdown
- **Key Libraries:** `marked` (Markdown), `react-helmet-async` (SEO/head)
- **Analytics:** Plausible (privacy-friendly, script in `index.html`)
- **Hosting target:** GitHub Pages (`jacobcdsmith.github.io`) — static SPA + pre-rendered HTML

## Project Structure
```
/
├── blog/
│   ├── posts/                  # Markdown sources
│   └── posts.json              # Post metadata (slug, date, title, excerpt, tags, category)
├── public/                     # Static assets shipped as-is
│   ├── favicon.svg
│   ├── og-default.svg          # Default Open Graph card
│   ├── llms.txt                # Short LLM-friendly site overview
│   └── jacob-c-smith-resume.pdf  # CV download (placeholder PDF — replace before launch)
├── scripts/
│   └── generate-blog-pages.mjs # Post-build: pre-renders all routes + blog posts,
│                               # generates sitemap.xml, robots.txt, rss.xml,
│                               # 404.html (GH Pages SPA), llms.txt, llms-full.txt
├── src/
│   ├── components/             # Header, Footer, ParticleCanvas, SEO, Button, Section,
│   │                           # Tag, Quote, FAQ, NewsletterForm, CVDownload,
│   │                           # ThemeToggle, SocialShare, RelatedPosts, CTABanner
│   ├── data/                   # profile, services, testimonials, faq, posts (synchronous
│   │                           # markdown loader via import.meta.glob)
│   ├── lib/                    # analytics (Plausible wrapper), structured-data helpers
│   ├── pages/                  # Home, About, Services, Projects, Experience, Contact,
│   │                           # BlogList, BlogPost
│   ├── App.jsx                 # Routes (incl. /skills → /about redirect)
│   ├── main.jsx                # React mount + pre-paint theme application
│   └── style.css               # Design tokens, light/dark theme via [data-theme]
├── index.html                  # SPA shell with full default SEO + Plausible
├── package.json
└── vite.config.js              # host 0.0.0.0, port 5000, allowedHosts: true
```

## Routes
- `/` Home — hero, three-pillars, services preview, recent posts, selected delivery, FAQ, newsletter, CTA
- `/about` About bio + CV download (industrial / agent / embedded skill clusters)
- `/services` Four scoped offerings (Industrial / Agent & AI / Local-first AI / Embedded & Edge) + FAQ
- `/projects` Project showcase (WVRTP, Hermes plugin, JCLAW, MCPStarfleetCommand, UNIHIKER, ESP32, EMERGENT-MCF-EI, this site, pro bono)
- `/experience` Career timeline (Readyfuels, Independent Practice, EMERGENT-MCF-EI, JCLAW, NewForce, Bridging Innovations) + CV download
- `/contact` Contact methods + active job-search signal
- `/blog` Blog index with search, category filters, featured post
- `/blog/:slug` Blog post with reading time, tags, social share, related posts
- `/skills` → redirects to `/about`

## SEO / AEO / GEO Stack
- Per-route `<title>`, description, canonical, OG, Twitter card via `SEO` component (react-helmet-async)
- JSON-LD: `Person`, `ProfessionalService`, `WebSite`, `Blog`, `BlogPosting`, `BreadcrumbList`
- `dist/sitemap.xml`, `dist/robots.txt`, `dist/rss.xml`
- `dist/llms.txt` (short overview) and `dist/llms-full.txt` (full prose dump of every blog post)
- Pre-rendered crawler-visible body inside `#app` for every route, replaced by SPA on hydration
- Plausible analytics with outbound-link tracking; `trackEvent` wrapper for custom events

## Theming
- Pre-paint script in `main.jsx` reads `localStorage.jcs-theme` (or `prefers-color-scheme`) and
  sets `<html data-theme="…">` before React renders to avoid flash.
- All colors driven by CSS custom properties in `:root` and `[data-theme="light"]` blocks.
- `ThemeToggle` component in the header.

## Development
- **Dev Server:** `npm run dev` — Vite on port 5000, host 0.0.0.0, allowedHosts: true
- **Build:** `npm run build` — `vite build` + `node scripts/generate-blog-pages.mjs`

## Deployment
- **Target:** GitHub Pages (or any static host)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- The `404.html` redirect script + `index.html` query-string decoder enable client-side routing on GH Pages.

## Known placeholders to replace before launch
- `public/jacob-c-smith-resume.pdf` — currently a minimal valid placeholder PDF
- Plausible `data-domain` in `index.html` and `scripts/generate-blog-pages.mjs` (currently `jacobcdsmith.github.io`)
- Newsletter form is currently `mailto:`-based; wire to a real provider when one is chosen

## Anonymization rules
- The regional hospitality client (referenced under pro-bono engagements) must NOT be named anywhere in copy, alt text, links, schema, or comments. Refer to it generically (e.g. "regional hospitality client").
- Spark / sparkwv.org and Bridging Innovations Morgantown are public references and may be named.
- Readyfuels (https://readyfuels.com) and Nous Research (https://nousresearch.com) are explicitly named external organizations with permission to reference.
