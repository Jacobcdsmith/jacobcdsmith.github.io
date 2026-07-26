# Jacob C. Smith Portfolio

## Project Overview
Public-facing professional site and blog for Jacob C. Smith — **data scientist and ML engineer** based in Buckhannon, West Virginia, transitioning from seven years of enterprise sales and account management (FleetPride, Cole Truck Parts) into applied analytics and machine learning via the NewForce Cohort 11 data science program. Tagline: *"I turn messy, high-dimensional data into decisions and systems that ship."*

Primary positioning is an **active job search** for full-time Data Scientist / ML Engineer roles (résumé front-and-center, `profile.availability` surfaced in the hero). Alongside that: data/ML projects (CONSIM GPU-accelerated signal processing, the GitHub Language Analysis Platform capstone), shipped client work — the WVRTP facility inspection system for **Readyfuels** (https://readyfuels.com) and the **Hermes plugin** for **Nous Research** (https://nousresearch.com) — and local-first AI/agent infrastructure (JCLAW, kairos). Scoped consulting engagements (the four service pillars: operational analytics, AI red-teaming, local-first AI systems, systems audits) remain available as a secondary offering, not the headline identity.

Audiences: employers & recruiters (résumé, projects, shipped work — primary), clients & teams (analytics / AI engagements — secondary), and researchers & builders (the writing).

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
│   └── posts.json              # Post metadata (slug, date, title, excerpt, tags,
│                               #   category, optional `hero` key for an interactive
│                               #   React hero figure — see HERO_FIGURES in BlogPost.jsx)
├── public/                     # Static assets shipped as-is
│   ├── favicon.svg             # Cyanotype-blue `jcs` mark
│   ├── og-default.svg / .png   # Default Open Graph card (source SVG + rendered PNG used in meta tags)
│   ├── favicon.ico / apple-touch-icon.png  # Rasterized from favicon.svg for legacy/iOS support
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
│   │                           # ThemeToggle, SocialShare, RelatedPosts, CTABanner,
│   │                           # AgentGatewaySchematic (interactive blueprint SVG;
│   │                           # also embeddable in the agent gateway blog post)
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
- `/` Home — hero ("messy, high-dimensional data into decisions that ship" voice + employer/client/peer audience trio + 3 pillars), TL;DR, services preview (4 pillars), recent posts, selected delivery (3 testimonial cards), FAQ, newsletter, CTA
- `/about` About bio + résumé download (ML & stats, data & analytics, deep learning/GPU, AI/agent systems, web/industrial, embedded skill clusters)
- `/services` Four scoped offerings (Operational Analytics / AI Red-Teaming / Local-First AI / Systems Audits & Decision Architecture) with proof links to Readyfuels and Nous Research embedded as evidence — positioned as secondary to the job search
- `/projects` Project showcase (GitHub Language Analysis Platform, CONSIM, WVRTP, JCLAW, Hermes plugin, kairos, agent-flow-canvas, Wave Analyzer, NIGHTMARE pentesting suite, UNIHIKER K10, ESP32-S3, this site, pro bono engagements). Featured "How it works" section above the grid renders an interactive `AgentGatewaySchematic` (cyanotype blueprint SVG; CLIENT → WS GATEWAY → SOUL.md → ROUTER → CODEGEN/RED-TEAM/RESOURCE → TOOL CALLS → RESPONSE) with three CSS-keyframe-animated request packets, hover-to-pause, click-to-reveal node detail, keyboard reachable, `prefers-reduced-motion` respected, screen-reader fallback list, light + dark theme.
- `/experience` Career timeline (FleetPride, Cole Truck Parts, NewForce Cohort 11, data/ML projects, Readyfuels + Nous Research delivery, Bridging Innovations) + résumé download
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

## Known placeholders / follow-ups
- `public/jacob-c-smith-resume.pdf` — real one-page résumé rendered from `scripts/resume/resume.html` (Chromium print-to-PDF). Keep both in sync with `src/data/profile.js` / Experience.
- WVRTP case study — done: `blog/posts/wvrtp-satellites-to-street-signs.md`, linked from the Projects page WVRTP card.
- `VITE_BUTTONDOWN_USERNAME` — wired into `.github/workflows/deploy.yml` as `${{ vars.VITE_BUTTONDOWN_USERNAME }}`, but the repository variable itself still needs to be set (Settings → Secrets and variables → Actions → Variables) with the real Buttondown username. Until then the build gets an empty value and the newsletter form falls back to `mailto:`.
- Google Search Console / Bing Webmaster verification — not yet done (requires the account owner). Placeholder `<meta>` tags are commented out in `index.html` and `scripts/generate-blog-pages.mjs`'s `routeShell` head — uncomment and fill in the real verification codes once the properties exist, then submit `https://jacobcdsmith.github.io/sitemap.xml` in both.
- Per-post OG images (`scripts/generate-blog-pages.mjs` → `postOgSvg`) are still SVG, not PNG. The site-wide default (`og-default.png`) was converted since it's what most link unfurlers (LinkedIn, Slack, iMessage) hit; per-post images are lower-traffic and would need a headless-render step added to the build (not currently a project dependency).
- Full git-history purge of the removed `attached_assets/` material (patent drafts, IP docs, ChatGPT export) — the tree-level removal is done on this branch, but scrubbing it out of prior commits on `main` requires a separate `git filter-repo` + force-push directly against `main`, outside this branch's scope. Do that as a deliberate, explicitly-confirmed step, not bundled into a normal PR.

## Plausible analytics
- `data-domain="jacobcdsmith.github.io"` is the **confirmed production value**, matching `profile.siteUrl`, the canonical/OG URLs, and the GitHub Pages hostname. The "placeholder" comment has been removed in both occurrences.
- Two places must stay in sync: the `<script defer data-domain="…">` tag in `index.html` and the same tag re-emitted by `scripts/generate-blog-pages.mjs` (route shell + blog post pre-renders). Comments in both files call this out.
- For events to actually record, a site with the hostname `jacobcdsmith.github.io` must exist in the Plausible dashboard. This is a manual one-time setup step in the Plausible account — it cannot be done from the codebase.
- Outbound link tracking is enabled via the `script.outbound-links.js` variant. 404 tracking can be added by switching to `script.outbound-links.404.js` (or `script.404.js`) once the dashboard is configured to receive 404 events; verify in production after the dashboard site is created.
- If a custom domain ever replaces the GitHub Pages URL, update both `<script>` tags together (and create a new site / migrate stats in the Plausible dashboard).

## Newsletter
- **Provider:** [Buttondown](https://buttondown.com) — chosen for its privacy-respecting posture, indie/research-friendly tone, simple form-encoded subscribe endpoint that works from a static site without an API key in the browser, and lack of third-party tracking scripts. Matches the site's "ad-free, privacy-respecting" stance.
- **Wiring:** `src/components/NewsletterForm.jsx` POSTs `email` + `embed=1` (form-encoded) to `https://buttondown.com/api/emails/embed-subscribe/<username>` via `fetch` with `mode: 'no-cors'`. Because that mode produces an opaque response, the form treats a resolved request as success and tells the visitor to check their inbox for Buttondown's double-opt-in confirmation email.
- **Configuration:** Set `VITE_BUTTONDOWN_USERNAME` at build time (e.g. as a GitHub Actions repository variable used by the build step). The value is embedded in the bundle; Buttondown's embed endpoint is public, so this is the intended pattern. Without it, the form falls back to `mailto:`.
- **States:** idle → loading (button disabled, "Subscribing…") → success ("check your inbox…") or error ("Something went wrong…"). Status messages use `role="status"` / `role="alert"` with `aria-live="polite"`.
- **Consent:** Fineprint under every form discloses Buttondown as the data processor with a link to their privacy policy and notes the unsubscribe path. No third-party sharing, no spam.

## Anonymization & naming rules
- The regional hospitality client (referenced under pro-bono engagements) must NOT be named anywhere in copy, alt text, links, schema, or comments. Refer to it generically (e.g. "regional hospitality client").
- Spark / sparkwv.org, NewForce, and Bridging Innovations Morgantown are public references and may be named.
- Readyfuels (https://readyfuels.com) and Nous Research (https://nousresearch.com) are explicitly named external organizations with permission to reference. Always link with `target="_blank" rel="noopener noreferrer"`.
- The site does not advertise an active W-2 job search; positioning is independent practice taking engagements.

## Snapshot / restore points
- `.local/prior/` contains a snapshot of the page + data files from commit `68e6870` (the prior iteration before the content refresh and design redesign). Useful as a reference if the user ever wants to pull individual paragraphs back.

## Monologue Compilation Book (offline pipeline)
- Python pipeline at `scripts/book/` produces a typeset PDF from Jacob's full ChatGPT export. One command: `npm run build:book`.
- **Source material is intentionally not in this repo.** `attached_assets/` (the ChatGPT export, patent drafts, and other IP documents) was removed from the tree and is now git-ignored — this is a public repository and that material must never be committed here. Supply the export locally out-of-band before running the pipeline.
- Voice is **blended**: user prompts and assistant replies are concatenated in chronological order with no role labels — the thread reads as one continuous mind.
- Pipeline: `parse.py` (walks the OpenAI export `mapping` tree) → `redact.py` (email + URL-token + sensitive-token regexes + `redact_terms.txt` wordlist with JSONL audit log) → `cluster.py` (TF-IDF + KMeans, ~12 chapters, top 5 threads per chapter scored by length × balance × engagement) → `typeset.py` (ReportLab; JetBrains Mono throughout, cyanotype `#1d4dba`, square corners, dashed rules, ALL-CAPS running headers).
- Outputs: `dist/monologue-compilation-DRAFT.pdf` + mirror copy at `attached_assets/monologue-compilation-DRAFT.pdf`. Audit log appended to `scripts/book/redaction.log` per run.
- Patent guard: any conversation whose title or body contains the `[REDACTED — PRE-FILING]` marker after redaction is **dropped from the book entirely**, not merely masked. Add patent-related terms to `redact_terms.txt` to expand the filter.
- Python deps: `scikit-learn`, `nltk`, `reportlab`, `pillow`, `numpy` (project-level). JetBrains Mono TTFs are bundled in `scripts/book/fonts/`.
- **Not linked from the site nav.** The book is a draft for Jacob's review; the optional `/book` SPA reader is a stretch goal that has not been built.
