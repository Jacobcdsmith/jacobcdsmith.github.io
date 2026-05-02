# Jacob C. Smith — Portfolio

[![Live Site](https://img.shields.io/badge/Live-jacobcdsmith.github.io-1d4dba?style=for-the-badge)](https://jacobcdsmith.github.io)
[![License](https://img.shields.io/badge/License-MIT-1d4dba?style=for-the-badge)](LICENSE)

> **Systems Engineer · AI Red-Teamer · Consciousness Researcher**

This repository is the source for [jacobcdsmith.github.io](https://jacobcdsmith.github.io) — the public-facing site and blog for Jacob C. Smith, an independent systems engineer and AI researcher based in Buckhannon, West Virginia.

The site presents the practice (operational analytics, AI red-teaming, local-first AI systems, decision-architecture audits), the current named engagements (the WVRTP facility inspection system for [Readyfuels](https://readyfuels.com) and the Hermes plugin for [Nous Research](https://nousresearch.com)), the open project work (JCLAW, MCPStarfleetCommand, EMERGENT-MCF-EI consciousness research, ESP32-S3 / UNIHIKER K10 embedded work), and a writing surface.

Tagline: *"I help teams turn messy reality into measurable systems."*

---

## Aesthetic

Archival / cyanotype-blue with monospace-heavy typography. Inspired by [nousresearch.com](https://nousresearch.com) (white background, ALL-CAPS monospace headings, dashed dividers, underlined section titles) and [readyfuels.com](https://readyfuels.com) (navy dark mode, bracket-wrapped wordmark).

- **Primary color:** Cyanotype blue `#1d4dba` (light), `#4d8aff` (dark)
- **Light surface:** `#ffffff`  /  **Dark surface:** `#0a1230` (Readyfuels navy)
- **Type:** JetBrains Mono for headings + UI, Inter for body prose
- **Geometry:** Square corners (radius 0–2px), no shadows, dashed dividers
- **Wordmark:** `[ JACOB C. SMITH ]` — brackets rendered via CSS `::before` / `::after`

Default theme follows the OS preference and falls back to light.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19, React Router 7 |
| Build Tool | Vite 8 |
| Markdown | `marked` |
| SEO/head | `react-helmet-async` |
| Analytics | Plausible (privacy-friendly) |
| Hosting | GitHub Pages (static SPA + pre-rendered HTML) |

---

## Structure

```
/
├── blog/
│   ├── posts/                  # Markdown sources
│   └── posts.json              # Post metadata (slug, date, title, tags, category)
├── public/                     # Static assets shipped as-is
│   ├── favicon.svg
│   ├── og-default.svg
│   ├── llms.txt                # Short LLM-friendly site overview
│   └── jacob-c-smith-resume.pdf  # CV download (placeholder — replace before launch)
├── scripts/
│   └── generate-blog-pages.mjs # Post-build: pre-renders all routes + posts,
│                               # generates sitemap.xml, robots.txt, rss.xml,
│                               # 404.html (GH Pages SPA), llms.txt, llms-full.txt
├── src/
│   ├── components/             # Header (bracket-wrapped brand), Footer,
│   │                           # ThemeToggle, SEO, Section, FAQ, etc.
│   ├── data/                   # profile, services, faq, posts loader
│   ├── lib/                    # analytics + structured-data helpers
│   ├── pages/                  # Home, About, Services, Projects, Experience,
│   │                           # Contact, BlogList, BlogPost
│   ├── App.jsx
│   ├── main.jsx                # React mount + pre-paint theme application
│   └── style.css               # Tokens + light/dark theme via [data-theme]
├── index.html                  # SPA shell with default SEO + Plausible
├── package.json
└── vite.config.js              # host 0.0.0.0, port 5000, allowedHosts: true
```

---

## Local Development

```bash
npm install
npm run dev
# Vite dev server on http://localhost:5000 (host 0.0.0.0, allowedHosts: true)
```

To build the production bundle (Vite build + static page generation):

```bash
npm run build
# Output: dist/
```

---

## Deployment

Target: **GitHub Pages**. Pushing to `main` triggers a deploy.

The `404.html` redirect script + `index.html` query-string decoder enable client-side routing on GH Pages. All routes (`/`, `/about`, `/services`, `/projects`, `/experience`, `/contact`, `/blog`, `/blog/:slug`) are pre-rendered into static HTML alongside the SPA bundle so crawlers and LLMs see real content on first byte.

### SEO / AEO / GEO stack

- Per-route `<title>`, description, canonical, OG, Twitter card via the `SEO` component (react-helmet-async)
- JSON-LD: `Person`, `ProfessionalService`, `WebSite`, `Blog`, `BlogPosting`, `BreadcrumbList`
- `sitemap.xml`, `robots.txt`, `rss.xml`
- `llms.txt` (short overview) and `llms-full.txt` (full prose dump of every blog post)
- Pre-rendered crawler-visible body inside `#app` for every route, replaced by SPA on hydration
- Plausible analytics with outbound-link tracking; `trackEvent` wrapper for custom events

---

## Customization

### Colors

Tokens live in `src/style.css`. Light is the default; `[data-theme='dark']` overrides for navy:

```css
:root {
  --color-primary: #1d4dba;       /* Cyanotype blue */
  --color-primary-strong: #163d8f;
  --bg: #ffffff;
  --text: #0a0f1f;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}

:root[data-theme='dark'] {
  --color-primary: #4d8aff;
  --bg: #0a1230;                  /* Readyfuels navy */
  --text: #e8edf7;
}
```

### Adding a Blog Post

1. Create a Markdown file in `blog/posts/` (e.g., `blog/posts/my-new-post.md`).
2. Add an entry to `blog/posts.json` with `slug`, `title`, `date`, `excerpt`, `tags`, `category`.
3. Run `npm run build` to regenerate static pages, OG images, sitemap, RSS, and `llms-full.txt`.

### Content Updates

- Profile / tagline / contact: `src/data/profile.js`
- Services (4 pillars): `src/data/services.js`
- FAQs: `src/data/faq.js`
- Page copy: `src/pages/*.jsx`

---

## Anonymization & Naming Rules

- The regional hospitality client (referenced under pro-bono engagements) must NOT be named anywhere in copy, alt text, links, schema, or comments. Refer to it generically (e.g. *regional hospitality client*).
- Spark / sparkwv.org, NewForce, and Bridging Innovations Morgantown are public references and may be named.
- Readyfuels (https://readyfuels.com) and Nous Research (https://nousresearch.com) are explicitly named external organizations with permission to reference. Always link with `target="_blank" rel="noopener noreferrer"`.
- The site does not advertise an active W-2 job search; positioning is independent practice taking engagements.

---

## License

MIT — see [LICENSE](LICENSE).

**Copyright © 2025 Jacob C. Smith**

---

## Contact

- Email: [jacobcsmithd@gmail.com](mailto:jacobcsmithd@gmail.com)
- Phone: [(304) 473-9980](tel:+13044739980)
- LinkedIn: [linkedin.com/in/jacobcsmith](https://linkedin.com/in/jacobcsmith)
- GitHub: [github.com/Jacobcdsmith](https://github.com/Jacobcdsmith)
