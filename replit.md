# Jacob C. Smith Portfolio

## Project Overview
Public-facing professional site and blog for Jacob C. Smith — independent **systems engineer, AI red-teamer, and consciousness researcher** based in Buckhannon, West Virginia. Tagline: *"I help teams turn messy reality into measurable systems."*

The practice runs four threads, presented as four service pillars: (1) operational analytics engagements (SQL/Python/BI plus formula-heavy KPI & safety scoring systems), (2) AI red-teaming & safety reviews of LLM features and agent stacks, (3) local-first AI systems (JCLAW, MCP infrastructure), (4) systems audits & decision architecture for founders and ops leaders. Current named engagements: the WVRTP facility inspection system for **Readyfuels** (https://readyfuels.com) and the **Hermes plugin** for **Nous Research** (https://nousresearch.com). Open research: EMERGENT-MCF-EI consciousness modeling, plus JCLAW / MCPStarfleetCommand / a local WebSocket MCP gateway. Embedded work on ESP32-S3 and a UNIHIKER K10 skill package. NewForce Cohort 11 graduate; Bridging Innovations Morgantown member.

Audiences: prospective clients & teams (analytics / AI / systems work), researchers & builders (the writing), and curious visitors. The site does NOT signal an active job search — it represents an independent practice taking engagements.

## Aesthetic
Archival / cyanotype-blue, monospace-heavy. Inspired by **nousresearch.com** (white background, ALL-CAPS monospace headings, dashed dividers, underlined section titles) and **readyfuels.com** (navy dark mode, bracket-wrapped wordmark `[JACOB C. SMITH]`). Square corners (radius 0–2px), no shadows, JetBrains Mono is the primary heading face with Inter for body prose. Cyanotype blue `#1d4dba` is the single accent color across light mode; dark mode is Readyfuels-style navy `#0a1230` with brighter blue `#4d8aff`. Default theme follows OS preference but falls back to light.

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
│   ├── favicon.svg             # Cyanotype-blue `jcs` mark
│   ├── og-default.svg          # Default Open Graph card (cyanotype blue)
│   ├── llms.txt                # Short LLM-friendly site overview
│   └── jacob-c-smith-resume.pdf  # CV download (placeholder PDF — replace before launch)
├── scripts/
│   └── generate-blog-pages.mjs # Post-build: pre-renders all routes + blog posts,
│                               # generates sitemap.xml, robots.txt, rss.xml,
│                               # 404.html (GH Pages SPA), llms.txt, llms-full.txt.
│                               # Inline visibleBody HTML uses #1d4dba (cyanotype blue).
├── src/
│   ├── components/             # Header (bracket-wrapped brand via ::before/::after),
│   │                           # Footer, ParticleCanvas (dark-mode only), SEO, Button,
│   │                           # Section, Tag, Quote, FAQ, NewsletterForm, CVDownload,
│   │                           # ThemeToggle, SocialShare, RelatedPosts, CTABanner
│   ├── data/                   # profile, services (4 original pillars), faq,
│   │                           # testimonials.json (factual delivery cards),
│   │                           # posts (synchronous markdown loader via import.meta.glob)
│   ├── lib/                    # analytics (Plausible wrapper), structured-data helpers
│   ├── pages/                  # Home, About, Services, Projects, Experience, Contact,
│   │                           # BlogList, BlogPost
│   ├── App.jsx                 # Routes (incl. /skills → /about redirect)
│   ├── main.jsx                # React mount + pre-paint theme application (light fallback)
│   └── style.css               # Design tokens, light/dark theme via [data-theme]
├── index.html                  # SPA shell with full default SEO + Plausible
├── package.json
└── vite.config.js              # host 0.0.0.0, port 5000, allowedHosts: true
```

## Routes
- `/` Home — hero (original "messy reality into measurable systems" voice + audience trio + 3 pillars), TL;DR, services preview (4 pillars), recent posts, selected delivery (3 testimonial cards), FAQ, newsletter, CTA
- `/about` About bio + CV download (operational analytics, AI red-teaming, local-first AI, embedded skill clusters)
- `/services` Four scoped offerings (Operational Analytics / AI Red-Teaming / Local-First AI / Systems Audits & Decision Architecture) with proof links to Readyfuels and Nous Research embedded as evidence
- `/projects` Project showcase (EMERGENT-MCF-EI, JCLAW, Hermes plugin, MCPStarfleetCommand, local WebSocket MCP gateway, WVRTP, UNIHIKER K10, ESP32-S3, this site, pro bono engagements)
- `/experience` Career timeline (Independent Practice with Readyfuels + Nous Research delivery, EMERGENT-MCF-EI, JCLAW, NewForce Cohort 11, Bridging Innovations) + CV download
- `/contact` Contact methods, free discovery call, NDAs welcome
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
- Pre-paint script in `index.html` (canonical), mirrored verbatim in `main.jsx` (fallback) and `scripts/generate-blog-pages.mjs` (`THEME_BOOTSTRAP_SCRIPT`). All three default to LIGHT when no `prefers-color-scheme: dark` is set.
- All colors driven by CSS custom properties in `:root` (light, default) and `:root[data-theme='dark']` (Readyfuels navy override).
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
- `public/jacob-c-smith-resume.pdf` — currently a minimal valid placeholder PDF (follow-up task #6)
- WVRTP case study (anonymized) is a follow-up task (#7) — not yet on the site
- Plausible `data-domain` in `index.html` and `scripts/generate-blog-pages.mjs` (currently `jacobcdsmith.github.io`)
- Newsletter form is currently `mailto:`-based; wire to a real provider when one is chosen

## Anonymization & naming rules
- The regional hospitality client (referenced under pro-bono engagements) must NOT be named anywhere in copy, alt text, links, schema, or comments. Refer to it generically (e.g. "regional hospitality client").
- Spark / sparkwv.org, NewForce, and Bridging Innovations Morgantown are public references and may be named.
- Readyfuels (https://readyfuels.com) and Nous Research (https://nousresearch.com) are explicitly named external organizations with permission to reference. Always link with `target="_blank" rel="noopener noreferrer"`.
- The site does not advertise an active W-2 job search; positioning is independent practice taking engagements.

## Snapshot / restore points
- `.local/prior/` contains a snapshot of the page + data files from commit `68e6870` (the prior iteration before the content refresh and design redesign). Useful as a reference if the user ever wants to pull individual paragraphs back.
