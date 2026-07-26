/**
 * generate-blog-pages.mjs
 *
 * Post-build script that generates:
 *  1. dist/<route>/index.html — static HTML for all primary routes (Home, About,
 *     Services, Projects, Experience, Contact, Blog) with SEO + structured data
 *     so crawlers and LLMs see real content even before the SPA hydrates.
 *  2. dist/blog/<slug>/index.html — fully pre-rendered blog post pages
 *  3. dist/sitemap.xml          — XML sitemap for all crawlable URLs
 *  4. dist/robots.txt           — robots directives
 *  5. dist/rss.xml              — RSS 2.0 feed of blog posts
 *  6. dist/404.html             — GitHub Pages SPA redirect
 *  7. dist/llms.txt             — short LLM-friendly site overview
 *  8. dist/llms-full.txt        — full prose dump for LLM consumption
 *
 * Run automatically after `vite build` via the "build" npm script.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { marked } from 'marked'
import { services as servicesData } from '../src/data/services.js'
import { homeFaq, servicesFaq } from '../src/data/faq.js'
import { profile } from '../src/data/profile.js'

marked.use({ renderer: { html() { return '' } } })

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, 'dist')
const BLOG_DIR = resolve(ROOT, 'blog')
const PUBLIC_DIR = resolve(ROOT, 'public')

const BASE_URL = profile.siteUrl
const SITE_NAME = profile.name
const ROLE = profile.role
const PERSON_DESCRIPTION = profile.authorBio
const SERVICE_DESCRIPTION = profile.subtagline

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJson(path) { return JSON.parse(readFileSync(path, 'utf-8')) }
function readText(path) { return readFileSync(path, 'utf-8') }

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function readingTime(md) {
  const words = md.replace(/```[\s\S]*?```/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_~>]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Read SPA bundle index.html (already produced by vite build) so we can
// extract <script>/<link> tags referencing the hashed assets, and re-inject
// them into our pre-rendered route HTML. Tolerates attribute-order variation
// and fails loudly if the expected tags can't be found.
function spaAssetTags() {
  const indexPath = resolve(DIST, 'index.html')
  if (!existsSync(indexPath)) {
    throw new Error('dist/index.html not found — run `vite build` first.')
  }
  const html = readText(indexPath)
  const headTags = []
  // Match <link …> tags whose rel is stylesheet or modulepreload, regardless
  // of where rel sits among the attributes.
  const linkRe = /<link\b[^>]*\brel=["'](?:stylesheet|modulepreload)["'][^>]*>/g
  let m
  while ((m = linkRe.exec(html))) headTags.push(m[0])
  const bodyTags = []
  // Match <script …src="/assets/..." …></script> regardless of attribute order.
  const scriptRe = /<script\b[^>]*\bsrc=["']\/assets\/[^"']+["'][^>]*><\/script>/g
  while ((m = scriptRe.exec(html))) bodyTags.push(m[0])

  if (bodyTags.length === 0) {
    throw new Error(
      'Could not extract SPA <script src="/assets/…"> tag from dist/index.html. ' +
      'Vite output format may have changed; update spaAssetTags() in scripts/generate-blog-pages.mjs.'
    )
  }
  if (headTags.length === 0) {
    console.warn(
      '[generate-blog-pages] Warning: no stylesheet/modulepreload <link> tags found in dist/index.html'
    )
  }
  return { head: headTags.join('\n  '), body: bodyTags.join('\n  ') }
}

// Inline pre-paint theme script — CANONICAL SOURCE.
// The same logic also exists (verbatim) in `index.html` <head> and as a
// JS fallback in `src/main.jsx`. If you change the rules here (storage key,
// preference detection), keep all three in sync to avoid theme flash.
const THEME_BOOTSTRAP_SCRIPT = `<script>(function(){try{var s=localStorage.getItem('jcs-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();</script>`

const ASSETS = spaAssetTags()

// ─── Route content templates (visible static body for crawlers/LLMs) ────────

function routeShell({
  title,
  description,
  path,
  visibleBody,
  jsonLd = [],
  type = 'website',
  publishedTime,
  tags = [],
  ogImage = `${BASE_URL}/og-default.png`,
}) {
  const canonical = `${BASE_URL}${path}`
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${ROLE}`
  const tagMeta = tags.map(t => `  <meta property="article:tag" content="${escHtml(t)}" />`).join('\n')
  const jsonLdBlocks = jsonLd
    .map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
    .join('\n  ')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0a1230" media="(prefers-color-scheme: dark)" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

  ${THEME_BOOTSTRAP_SCRIPT}

  <title>${escHtml(fullTitle)}</title>
  <meta name="description" content="${escHtml(description)}" />
  <meta name="author" content="${SITE_NAME}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} — Blog" href="${BASE_URL}/rss.xml" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- Google Search Console / Bing Webmaster verification placeholder — keep
       in sync with index.html. Replace with the real codes once the
       properties exist, then submit ${BASE_URL}/sitemap.xml in both.
  <meta name="google-site-verification" content="REPLACE_WITH_REAL_CODE" />
  <meta name="msvalidate.01" content="REPLACE_WITH_REAL_CODE" />
  -->

  <meta property="og:title" content="${escHtml(fullTitle)}" />
  <meta property="og:description" content="${escHtml(description)}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  ${publishedTime ? `<meta property="article:published_time" content="${publishedTime}" />` : ''}
  ${type === 'article' ? `<meta property="article:author" content="${SITE_NAME}" />` : ''}
${tagMeta}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escHtml(fullTitle)}" />
  <meta name="twitter:description" content="${escHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />

  ${jsonLdBlocks}

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" />

  <!-- Plausible analytics. data-domain MUST match the live site hostname and
       the site registered in the Plausible dashboard. Keep in sync with the
       same <script> tag in /index.html. If the production hostname ever
       changes (e.g. a custom domain replaces GitHub Pages), update both
       places together. -->
  <script defer data-domain="jacobcdsmith.github.io" src="https://plausible.io/js/script.outbound-links.js"></script>
  <script>window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>

  ${ASSETS.head}
</head>
<body>
  <noscript>
    <style>.crawl-only{display:block !important;}</style>
  </noscript>
  <div id="app">
    <!-- Static crawler-visible content; replaced by SPA on hydration. -->
    <div class="crawl-only" style="max-width:780px;margin:2rem auto;padding:1.5rem;font-family:Inter,system-ui,sans-serif;color:#0a0f1f;background:#ffffff;">
      ${visibleBody}
    </div>
  </div>
  <script>
    (function(l) {
      if (l.search[1] === '/') {
        var decoded = l.search.slice(1).split('&').map(function(s) {
          return s.replace(/~and~/g, '&');
        });
        window.history.replaceState(null, null,
          decoded.shift() + (decoded.length ? '?' + decoded.join('&') : '') + l.hash
        );
      }
    }(window.location));
  </script>
  ${ASSETS.body}
</body>
</html>`
}

// Static body builder
function visibleBlock({ eyebrow, title, lead, body, tldr }) {
  const tldrBlock = tldr ? `
      <aside style="border-left:2px solid #1d4dba;background:rgba(29,77,186,0.06);padding:0.9rem 1.15rem;margin:1.25rem 0 1.5rem;border-radius:0 4px 4px 0;max-width:64ch;">
        <p style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:#1d4dba;margin:0 0 0.4rem;font-weight:600;">TL;DR</p>
        <p style="margin:0;color:#0a0f1f;font-size:0.97rem;line-height:1.6;">${tldr}</p>
      </aside>` : ''
  return `
      <p style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;color:#1d4dba;margin:0 0 0.85rem;">${escHtml(eyebrow)}</p>
      <h1 style="font-family:'JetBrains Mono',ui-monospace,monospace;text-transform:uppercase;font-size:2.25rem;line-height:1.15;letter-spacing:0;margin:0 0 1rem;color:#0a0f1f;font-weight:700;">${escHtml(title)}</h1>
      <p style="font-size:1.1rem;color:#7a8090;margin:0 0 1.5rem;max-width:60ch;">${escHtml(lead)}</p>
      ${tldrBlock}
      ${body}
      <p style="margin-top:2rem;font-size:0.85rem;color:#7a8090;">
        <a href="/" style="color:#1d4dba;">Home</a> ·
        <a href="/about" style="color:#1d4dba;">About</a> ·
        <a href="/services" style="color:#1d4dba;">Services</a> ·
        <a href="/projects" style="color:#1d4dba;">Projects</a> ·
        <a href="/research" style="color:#1d4dba;">Research</a> ·
        <a href="/experience" style="color:#1d4dba;">Experience</a> ·
        <a href="/blog" style="color:#1d4dba;">Blog</a> ·
        <a href="/contact" style="color:#1d4dba;">Contact</a>
      </p>
  `
}

// ─── Route definitions ──────────────────────────────────────────────────────

const personJson = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  url: BASE_URL,
  jobTitle: ROLE,
  email: 'mailto:jacobcsmithd@gmail.com',
  telephone: '+13044739980',
  address: { '@type': 'PostalAddress', addressLocality: 'Buckhannon', addressRegion: 'WV', addressCountry: 'US' },
  sameAs: [profile.github, profile.linkedin],
  description: PERSON_DESCRIPTION,
  alumniOf: { '@type': 'EducationalOrganization', name: 'NewForce' },
  knowsAbout: ['Data Science', 'Machine Learning', 'Python', 'SQL', 'JavaScript', 'Full-Stack Web Development', 'GPU-accelerated computing', 'Data Analytics', 'Statistical Modeling', 'API Integration'],
}

const profServiceJson = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `${SITE_NAME} — ${ROLE}`,
  url: BASE_URL,
  image: `${BASE_URL}/og-default.png`,
  priceRange: '$$',
  address: { '@type': 'PostalAddress', addressLocality: 'Buckhannon', addressRegion: 'WV', addressCountry: 'US' },
  areaServed: 'Worldwide (remote)',
  description: SERVICE_DESCRIPTION,
}

const websiteJson = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/blog?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

function bcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

function faqJson(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(it => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}

function serviceJson(svc) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: svc.title,
    description: svc.summary,
    provider: { '@type': 'Person', name: SITE_NAME, url: BASE_URL },
    areaServed: 'Worldwide (remote)',
    serviceType: svc.title,
  }
}

function staticRoutes(posts) {
  return [
    {
      path: '/',
      title: null,
      description: 'Jacob C. Smith — data scientist and ML engineer based in Buckhannon, West Virginia, transitioning from enterprise sales into applied analytics and machine learning. GPU-accelerated ML systems, production analytics, and shipped industrial tooling for Readyfuels. Open to full-time roles.',
      jsonLd: [personJson, profServiceJson, websiteJson, faqJson(homeFaq)],
      visibleBody: visibleBlock({
        eyebrow: `Data Scientist & ML Engineer · Buckhannon, WV`,
        title: 'I turn messy, high-dimensional data into decisions and systems that ship.',
        lead: 'Data scientist and ML engineer transitioning from seven years of enterprise sales into applied analytics and machine learning. GPU-accelerated ML systems, production dashboards, and shipped industrial tooling — for teams that need answers, not another tool.',
        tldr: 'Jacob C. Smith is a data scientist and ML engineer based in Buckhannon, West Virginia, transitioning from enterprise sales (FleetPride, Cole Truck Parts) into applied analytics and ML through the NewForce Cohort 11 data science program. Builds GPU-accelerated ML systems (CONSIM), production analytics, and ships real client work — the WVRTP facility inspection system for Readyfuels and the Hermes plugin for Nous Research. Open to full-time Data Scientist / ML Engineer roles.',
        body: `
          <p style="margin:1.5rem 0;">
            <a href="/jacob-c-smith-resume.pdf" style="color:#1d4dba;font-weight:500;">Download résumé →</a> &nbsp;
            <a href="/projects" style="color:#1d4dba;">See the projects →</a> &nbsp;
            <a href="/contact" style="color:#1d4dba;">Get in touch →</a>
          </p>
          <h2 style="font-family:'JetBrains Mono',monospace;text-transform:uppercase;font-size:1.1rem;letter-spacing:0.05em;margin:2rem 0 0.85rem;color:#0a0f1f;">Three things I do</h2>
          <ul style="padding-left:1.2rem;color:#0a0f1f;">
            <li><strong>Applied data science &amp; ML</strong> — GPU-accelerated signal processing (CONSIM), predictive models, and analysis capstones across 1,200+ repos.</li>
            <li><strong>Operational analytics</strong> — dashboards, forecasts, and KPI / safety formula systems shipped for Readyfuels (WVRTP).</li>
            <li><strong>Local-first AI tools</strong> — JCLAW, kairos, and agent/MCP infrastructure built so data never has to leave the room.</li>
          </ul>
          <p><a href="/services" style="color:#1d4dba;">See all services →</a></p>
        `,
      }),
    },
    {
      path: '/about',
      title: 'About',
      description: 'Jacob C. Smith — data scientist and ML engineer transitioning from enterprise sales into applied analytics and machine learning, based in Buckhannon, West Virginia.',
      jsonLd: [personJson, bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'About', url: `${BASE_URL}/about` }])],
      visibleBody: visibleBlock({
        eyebrow: 'About',
        title: 'Jacob C. Smith.',
        lead: 'Data scientist and ML engineer based in Buckhannon, West Virginia, transitioning from seven years of enterprise sales into applied analytics and machine learning.',
        tldr: 'Jacob C. Smith is a data scientist and ML engineer based in Buckhannon, West Virginia. After seven years in enterprise sales and account management (FleetPride, Cole Truck Parts), he completed the NewForce Cohort 11 data science program and now builds GPU-accelerated ML systems, production analytics, and shipped client work — the WVRTP facility inspection system for Readyfuels (https://readyfuels.com) and the Hermes plugin for Nous Research (https://nousresearch.com). Open to full-time Data Scientist / ML Engineer roles.',
        body: `<p>Seven years in enterprise sales and account management taught me how decisions actually get made inside a business — what data gets trusted, what gets ignored, and why. The NewForce Cohort 11 data science program gave me the tools to build the systems that should have existed the whole time: SQL, Python, statistical modeling, and dashboard architecture that stakeholders actually use.</p>
        <p>On the ML side, <strong>CONSIM</strong> is a GPU-accelerated framework for real-time pattern detection in high-dimensional time-series data — a 20x performance uplift over a CPU baseline using CUDA/PyTorch and JAX, with phase-coherence tracking and spectral-analysis modules for streaming anomaly detection. The <strong>GitHub Language Analysis Platform</strong> is a data-analysis capstone spanning 1,200+ repositories, from ANOVA-backed language comparisons to an interactive React/Plotly dashboard.</p>
        <p>On the delivery side: for <strong>Readyfuels</strong> I shipped the WVRTP facility inspection system — a React/Vite/TypeScript app on Vercel with QR-driven capture and Power Automate pipelines — alongside a 1,135-formula safety + KPI Excel workbook used by operators in the field. For <strong>Nous Research</strong> I built the Hermes plugin, a three-subagent agent stack. I also maintain <strong>JCLAW</strong> and <strong>kairos</strong>, local-first AI/agent infrastructure built so data never has to leave the room.</p>
        <p><a href="/jacob-c-smith-resume.pdf" style="color:#1d4dba;">Download résumé →</a></p>`,
      }),
    },
    {
      path: '/services',
      title: 'Services',
      description: 'Operational analytics, AI red-teaming, local-first AI systems, and decision-architecture audits — scoped engagements with clear deliverables.',
      jsonLd: [
        bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Services', url: `${BASE_URL}/services` }]),
        profServiceJson,
        ...servicesData.map(serviceJson),
        faqJson(servicesFaq),
      ],
      visibleBody: visibleBlock({
        eyebrow: 'Services',
        title: 'Engagements that ship.',
        lead: 'Four ways I work with teams. Each one is scoped, time-bound, and produces an artifact your team owns.',
        tldr: 'Operational analytics engagements (proven on the WVRTP work for Readyfuels), AI red-teaming and safety reviews (delivered as a subagent inside the Hermes plugin for Nous Research), local-first AI systems (JCLAW + MCP infrastructure), and systems audits / decision-architecture work. Most engagements are 2–4 weeks with optional retainer.',
        body: `<ul style="padding-left:1.2rem;color:#0a0f1f;">
          <li><strong>Operational analytics</strong> — proof case: <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer" style="color:#1d4dba;">Readyfuels</a> (WVRTP facility inspection system + 1,135-formula safety / KPI workbook).</li>
          <li><strong>AI red-teaming &amp; safety reviews</strong> — delivery example: <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer" style="color:#1d4dba;">Nous Research</a> (red-team subagent inside the Hermes plugin).</li>
          <li><strong>Local-first AI systems</strong> — JCLAW, MCPStarfleetCommand, local WebSocket MCP gateway.</li>
          <li><strong>Systems audits &amp; decision architecture</strong> — for founders and ops leaders who need an outside systems-thinker to map what’s actually happening and what to do next.</li>
        </ul>
        <p>Discovery calls are free. Email <a href="mailto:jacobcsmithd@gmail.com" style="color:#1d4dba;">jacobcsmithd@gmail.com</a> to start.</p>`,
      }),
    },
    {
      path: '/projects',
      title: 'Projects',
      description: 'GitHub Language Analysis Platform, CONSIM GPU-accelerated signal processing, WVRTP facility inspection system (Readyfuels), JCLAW agentic runtime, Hermes plugin (Nous Research), kairos, Wave Analyzer, a red-teaming console, plus embedded and operational analytics work.',
      jsonLd: [bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Projects', url: `${BASE_URL}/projects` }])],
      visibleBody: visibleBlock({
        eyebrow: 'Projects',
        title: 'Things I’m building.',
        lead: 'A mix of data analysis capstones, GPU-accelerated ML, shipped client work, and agent / local-first AI infrastructure.',
        tldr: 'Data & ML: the GitHub Language Analysis Platform (1,200+ repo capstone) and CONSIM, a GPU-accelerated signal-processing framework with a 20x performance uplift via CUDA/PyTorch/JAX. Industrial: the WVRTP facility inspection system for Readyfuels. Agent infrastructure: JCLAW, the Hermes plugin for Nous Research, and kairos, a local-first knowledge tool. Also: an Android RF/audio spectrum analyzer, a red-teaming console, and embedded work on the UNIHIKER K10 and ESP32-S3. Most paid client work is operational analytics under NDA.',
        body: `<ul style="padding-left:1.2rem;color:#0a0f1f;">
          <li><strong>GitHub Language Analysis Platform</strong> — data-analysis capstone across 1,200+ repos; Jupyter notebook pipeline feeding a React/Plotly dashboard. <a href="https://git-hub-language-capstone.vercel.app/" target="_blank" rel="noopener noreferrer" style="color:#1d4dba;">Live demo</a>.</li>
          <li><strong>CONSIM</strong> — GPU-accelerated framework for real-time pattern detection in high-dimensional time-series data; 20x performance uplift via CUDA/PyTorch/JAX.</li>
          <li><strong>WVRTP Facility Inspection System</strong> — React/Vite/TypeScript on Vercel for <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer" style="color:#1d4dba;">Readyfuels</a>; QR + Power Automate; companion 1,135-formula safety + KPI workbook. <a href="/blog/wvrtp-satellites-to-street-signs" style="color:#1d4dba;">Read the case study</a>.</li>
          <li><strong>JCLAW</strong> — SQLite-backed agentic runtime with multi-provider routing, MCP, branching, evals.</li>
          <li><strong>Hermes plugin</strong> — three-subagent stack with persistent SOUL.md identity for <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer" style="color:#1d4dba;">Nous Research</a>.</li>
          <li><strong>kairos</strong> — local-first knowledge workspace; explicit, typed, provenance-first search with zero embeddings.</li>
          <li><strong>agent-flow-canvas</strong> — browser-based visual builder for AI agent workflows, zero backend.</li>
          <li><strong>Wave Analyzer (OmniWave)</strong> — Android real-time audio/RF spectrum analyzer with AI signal classification.</li>
          <li><strong>NIGHTMARE Penetration Testing Suite</strong> — web-based console for authorized security testing; concrete artifact behind the AI red-teaming practice.</li>
          <li><strong>UNIHIKER K10 skill package</strong> — MicroPython + full C/C++ SDK against the real hardware schematic.</li>
          <li><strong>ESP32-S3 firmware</strong> — modular ESP-IDF / C work with documented module boundaries.</li>
          <li><strong>jacobcdsmith.github.io</strong> — this site. Static React + Vite SPA with pre-rendered HTML.</li>
          <li><strong>Pro bono</strong> — regional hospitality client (ecommerce platform pivot evaluation), Spark / sparkwv.org (HostGator → Google Workspace email migration, zero downtime).</li>
        </ul>`,
      }),
    },
    {
      path: '/research',
      title: 'Research',
      description: 'First-party research and IP from Jacob C. Smith — one public theory paper and a small portfolio of summary-only items (one in revision, three pre-filing).',
      jsonLd: [bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Research', url: `${BASE_URL}/research` }])],
      visibleBody: visibleBlock({
        eyebrow: 'Research',
        title: 'First-party research & IP.',
        lead: 'Reference material that sits separate from client work and from the long-form blog.',
        tldr: 'One public theory paper. Four summary-only items — one in revision, three pre-filing. Additional unpublished IP exists and is available under NDA. Email jacobcsmithd@gmail.com for post-filing materials or NDA access.',
        body: `<ul style="padding-left:1.2rem;color:#0a0f1f;">
          <li><strong>Causal Compression Graphs (CCG)</strong> — public theory paper. <a href="/research/causal-compression-graphs.md" style="color:#1d4dba;">Read (Markdown)</a>.</li>
          <li><strong>Emergent Relational Ontology (ERO)</strong> — in revision. Summary only; not yet ready for public release.</li>
          <li><strong>Hysteretic Computing</strong> — pre-filing. Summary only; details on request post-filing.</li>
          <li><strong>Multicomputational Phase Transitions in Quantum-Classical Hybrid Systems</strong> — pre-filing. Summary only; details on request post-filing.</li>
          <li><strong>Operationalized Section 8: Multicomputation Branching</strong> — pre-filing. Summary only; details on request post-filing.</li>
        </ul>
        <p style="margin-top:1rem;font-size:0.95rem;color:#0a0f1f;">Additional unpublished IP exists and is available under NDA — email <a href="mailto:jacobcsmithd@gmail.com" style="color:#1d4dba;">jacobcsmithd@gmail.com</a>.</p>`,
      }),
    },
    {
      path: '/experience',
      title: 'Experience',
      description: 'Career transition from enterprise sales (FleetPride, Cole Truck Parts) into data science via NewForce Cohort 11; GPU-accelerated ML (CONSIM); shipped client work with Readyfuels (WVRTP) and Nous Research (Hermes plugin).',
      jsonLd: [bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Experience', url: `${BASE_URL}/experience` }])],
      visibleBody: visibleBlock({
        eyebrow: 'Experience',
        title: 'Selected work.',
        lead: 'A short version. For the long version, download the résumé or email for references on specific engagements.',
        tldr: 'Jacob C. Smith spent seven years in enterprise sales and account management (FleetPride, Cole Truck Parts) before completing the NewForce Cohort 11 data science program. He now builds GPU-accelerated ML systems (CONSIM), production analytics, and has shipped the WVRTP facility inspection system for Readyfuels and the Hermes plugin for Nous Research. Open to full-time Data Scientist / ML Engineer roles.',
        body: `<p><a href="/jacob-c-smith-resume.pdf" style="color:#1d4dba;">Download résumé →</a></p>`,
      }),
    },
    {
      path: '/contact',
      title: 'Contact',
      description: 'Get in touch with Jacob C. Smith. Email is the fastest way; phone for urgent matters. Discovery calls are free; NDAs welcome.',
      jsonLd: [bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Contact', url: `${BASE_URL}/contact` }])],
      visibleBody: visibleBlock({
        eyebrow: 'Contact',
        title: 'Let’s talk.',
        lead: 'One paragraph about the problem you’re trying to solve is enough to start. Discovery calls are free; NDAs welcome.',
        tldr: `The fastest way to reach ${SITE_NAME} is email (jacobcsmithd@gmail.com) or phone ((304) 473-9980). Most engagements start with a free 30-minute discovery call. Based in Buckhannon, West Virginia; works remotely worldwide.`,
        body: `<ul style="padding-left:1.2rem;color:#0a0f1f;">
          <li>Email: <a href="mailto:jacobcsmithd@gmail.com" style="color:#1d4dba;">jacobcsmithd@gmail.com</a></li>
          <li>Phone: <a href="tel:+13044739980" style="color:#1d4dba;">(304) 473-9980</a></li>
          <li>GitHub: <a href="https://github.com/Jacobcdsmith" style="color:#1d4dba;">github.com/Jacobcdsmith</a></li>
          <li>LinkedIn: <a href="https://linkedin.com/in/jacob-c-smith" style="color:#1d4dba;">linkedin.com/in/jacob-c-smith</a></li>
          <li>Location: Buckhannon, West Virginia, USA</li>
        </ul>`,
      }),
    },
    {
      path: '/blog',
      title: 'Blog',
      description: 'Long-form writing on consciousness modeling, local-first AI, decision systems, and the practice of building.',
      jsonLd: [
        websiteJson,
        bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Blog', url: `${BASE_URL}/blog` }]),
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: `${SITE_NAME} — Blog`,
          url: `${BASE_URL}/blog`,
          author: { '@type': 'Person', name: SITE_NAME, url: BASE_URL },
          blogPost: posts.map(p => ({
            '@type': 'BlogPosting',
            headline: p.title,
            datePublished: p.date,
            description: p.excerpt,
            url: `${BASE_URL}/blog/${p.slug}/`,
          })),
        },
      ],
      visibleBody: visibleBlock({
        eyebrow: 'Writing',
        title: 'The blog.',
        lead: 'Notes on consciousness modeling, local-first AI, decision systems, and the slow craft of shipping useful things.',
        tldr: 'Long-form posts by Jacob C. Smith, organized into three categories — Research (consciousness modeling, EMERGENT-MCF-EI, mathematics), Engineering (local-first AI, runtimes, tooling), and Essays (systems thinking, decision architecture).',
        body: `<ul style="padding-left:1.2rem;color:#0a0f1f;">
          ${posts.map(p => `<li><a href="/blog/${p.slug}/" style="color:#1d4dba;">${escHtml(p.title)}</a> — <span style="color:#7a8090;">${formatDate(p.date)}</span></li>`).join('\n          ')}
        </ul>`,
      }),
    },
  ]
}

// ─── Blog post page ─────────────────────────────────────────────────────────

function blogPostHtml({ post, htmlContent }) {
  const canonical = `${BASE_URL}/blog/${post.slug}/`
  const ogImage = `${BASE_URL}/og/${post.slug}.svg`
  const json = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: SITE_NAME, url: BASE_URL },
    publisher: { '@type': 'Person', name: SITE_NAME },
    url: canonical,
    image: ogImage,
    keywords: (post.tags || []).join(', '),
    wordCount: post.markdown ? post.markdown.split(/\s+/).filter(Boolean).length : undefined,
    mainEntityOfPage: canonical,
  }
  const breadcrumb = bcrumb([
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: `${BASE_URL}/blog` },
    { name: post.title, url: canonical },
  ])

  const visibleBody = `
    <p style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;color:#1d4dba;margin:0 0 0.85rem;">Blog</p>
    <h1 style="font-family:'JetBrains Mono',ui-monospace,monospace;text-transform:uppercase;font-size:2rem;line-height:1.2;letter-spacing:0;margin:0 0 1rem;color:#0a0f1f;font-weight:700;">${escHtml(post.title)}</h1>
    <p style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;color:#7a8090;margin:0 0 1.5rem;">${formatDate(post.date)} · ${readingTime(post.markdown)} min read · by Jacob C. Smith</p>
    <p style="font-size:1.1rem;color:#7a8090;margin:0 0 2rem;">${escHtml(post.excerpt)}</p>
    <article style="font-size:1.05rem;line-height:1.75;">${htmlContent}</article>
    <p style="margin-top:2rem;font-size:0.85rem;color:#7a8090;"><a href="/blog" style="color:#1d4dba;">← All posts</a></p>
  `

  return routeShell({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}/`,
    type: 'article',
    publishedTime: post.date,
    tags: post.tags || [],
    jsonLd: [json, breadcrumb],
    visibleBody,
    ogImage,
  })
}

// ─── Per-post OG image (templated SVG) ──────────────────────────────────────

function wrapTitleForOg(title, maxCharsPerLine = 26) {
  const words = title.split(/\s+/)
  const lines = []
  let current = ''
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current)
      current = w
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 4)
}

function postOgSvg(post) {
  const lines = wrapTitleForOg(post.title)
  const baseY = 230
  const lineHeight = 88
  const titleSvg = lines
    .map((line, i) => `<tspan x="80" y="${baseY + i * lineHeight}">${escHtml(line)}</tspan>`)
    .join('')
  const dateLabel = formatDate(post.date)
  const category = (post.category || 'Notes').toUpperCase()
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f4f4f2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="630" fill="#1d4dba"/>
  <line x1="60" y1="60" x2="1140" y2="60" stroke="#1d4dba" stroke-width="2" stroke-dasharray="6 6"/>
  <line x1="60" y1="570" x2="1140" y2="570" stroke="#1d4dba" stroke-width="2" stroke-dasharray="6 6"/>
  <text x="80" y="120" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="22" font-weight="600" letter-spacing="6" fill="#1d4dba">[ ${escHtml(category)} ] · ${SITE_NAME.toUpperCase()}</text>
  <text font-family="'JetBrains Mono', ui-monospace, monospace" font-size="60" font-weight="700" fill="#0a0f1f" letter-spacing="-1">${titleSvg}</text>
  <text x="80" y="560" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="20" fill="#4b5263">${escHtml(dateLabel)} · ${readingTime(post.markdown)} min read · by ${SITE_NAME}</text>
  <text x="1120" y="560" text-anchor="end" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="20" fill="#7a8090">jacobcdsmith.github.io</text>
</svg>
`
}

function writePostOgImage(post) {
  const ogDir = resolve(DIST, 'og')
  mkdirSync(ogDir, { recursive: true })
  writeFileSync(resolve(ogDir, `${post.slug}.svg`), postOgSvg(post), 'utf-8')
}

// ─── Sitemap, robots, RSS, llms ─────────────────────────────────────────────

function generateSitemap(posts) {
  const today = new Date().toISOString().split('T')[0]
  const pages = [
    { url: `${BASE_URL}/`, priority: '1.0', changefreq: 'monthly', lastmod: today },
    { url: `${BASE_URL}/about`, priority: '0.9', changefreq: 'monthly', lastmod: today },
    { url: `${BASE_URL}/services`, priority: '0.9', changefreq: 'monthly', lastmod: today },
    { url: `${BASE_URL}/projects`, priority: '0.8', changefreq: 'monthly', lastmod: today },
    { url: `${BASE_URL}/research`, priority: '0.8', changefreq: 'monthly', lastmod: today },
    { url: `${BASE_URL}/experience`, priority: '0.7', changefreq: 'monthly', lastmod: today },
    { url: `${BASE_URL}/contact`, priority: '0.6', changefreq: 'yearly', lastmod: today },
    { url: `${BASE_URL}/blog`, priority: '0.9', changefreq: 'weekly', lastmod: today },
  ]
  for (const p of posts) {
    pages.push({
      url: `${BASE_URL}/blog/${p.slug}/`,
      priority: '0.8',
      changefreq: 'yearly',
      lastmod: p.date,
    })
  }
  const items = pages
    .map(p => `  <url>\n    <loc>${p.url}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`
}

function generateRss(posts) {
  const now = new Date().toUTCString()
  const items = posts
    .map(p => {
      const url = `${BASE_URL}/blog/${p.slug}/`
      const pubDate = new Date(p.date + 'T00:00:00Z').toUTCString()
      return `    <item>
      <title>${escHtml(p.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escHtml(p.excerpt)}</description>
      ${(p.tags || []).map(t => `<category>${escHtml(t)}</category>`).join('\n      ')}
    </item>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Long-form writing on data science, ML systems, local-first AI, and the practice of building.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

function generateLlmsFull(posts) {
  let out = `# Jacob C. Smith — Full Site Content\n`
  out += `\nGenerated: ${new Date().toISOString()}\n`
  out += `Site: ${BASE_URL}\n\n`
  out += `## About\n`
  out += `Jacob C. Smith is a data scientist and ML engineer based in Buckhannon, West Virginia, transitioning from seven years of enterprise sales and account management (FleetPride, Cole Truck Parts) into applied analytics and machine learning via the NewForce Cohort 11 data science program. Builds GPU-accelerated ML systems (CONSIM) and production analytics; has shipped the WVRTP facility inspection system for Readyfuels (https://readyfuels.com) and the Hermes plugin for Nous Research (https://nousresearch.com). Also maintains JCLAW and kairos, local-first AI/agent infrastructure. Open to full-time Data Scientist / ML Engineer roles.\n\n`
  out += `Practice areas: data science and ML engineering, operational analytics, AI red-teaming and safety reviews, and local-first AI systems.\n\n`
  out += `Contact: jacobcsmithd@gmail.com · (304) 473-9980 · github.com/Jacobcdsmith · linkedin.com/in/jacob-c-smith\n\n`
  out += `## Research & IP\n`
  out += `First-party reference material, separate from client work and blog. One public document is linked from /research:\n`
  out += `- Causal Compression Graphs (CCG): public theory paper. ${BASE_URL}/research/causal-compression-graphs.md\n`
  out += `Four items are listed by summary only: Emergent Relational Ontology (ERO) — in revision, not yet ready for public release; and three pre-filing items (Hysteretic Computing, Multicomputational Phase Transitions in Quantum-Classical Hybrid Systems, and Operationalized Section 8: Multicomputation Branching) for which details are available on request post-filing. Additional unpublished IP exists and is available under NDA.\n\n`
  out += `---\n\n## Blog Posts (full text)\n\n`
  for (const p of posts) {
    out += `### ${p.title}\n`
    out += `Published: ${p.date}\n`
    out += `URL: ${BASE_URL}/blog/${p.slug}/\n`
    out += `Tags: ${(p.tags || []).join(', ')}\n\n`
    out += `${stripMarkdown(p.markdown)}\n\n---\n\n`
  }
  return out
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const postsManifest = readJson(resolve(BLOG_DIR, 'posts.json'))
  const posts = postsManifest
    .map(p => {
      const md = readText(resolve(BLOG_DIR, 'posts', `${p.slug}.md`))
      return { ...p, markdown: md }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))

  // 1. Pre-render primary routes
  const routes = staticRoutes(posts)
  for (const r of routes) {
    const html = routeShell(r)
    if (r.path === '/') {
      writeFileSync(resolve(DIST, 'index.html'), html, 'utf-8')
      console.log('  ✓ index.html (Home, pre-rendered)')
    } else {
      const dir = resolve(DIST, r.path.replace(/^\//, ''))
      mkdirSync(dir, { recursive: true })
      writeFileSync(resolve(dir, 'index.html'), html, 'utf-8')
      console.log(`  ✓ ${r.path}/index.html`)
    }
  }

  // 2. Blog posts (and their per-post OG images)
  for (const post of posts) {
    const html = marked.parse(post.markdown)
    const outDir = resolve(DIST, 'blog', post.slug)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(resolve(outDir, 'index.html'), blogPostHtml({ post, htmlContent: html }), 'utf-8')
    writePostOgImage(post)
    console.log(`  ✓ blog/${post.slug}/index.html (+ og/${post.slug}.svg)`)
  }

  // 3. Sitemap
  writeFileSync(resolve(DIST, 'sitemap.xml'), generateSitemap(posts), 'utf-8')
  console.log('  ✓ sitemap.xml')

  // 4. robots.txt
  writeFileSync(
    resolve(DIST, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`,
    'utf-8',
  )
  console.log('  ✓ robots.txt')

  // 5. RSS
  writeFileSync(resolve(DIST, 'rss.xml'), generateRss(posts), 'utf-8')
  console.log('  ✓ rss.xml')

  // 6. 404 — for SPA routing on GitHub Pages
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${SITE_NAME}</title>
  <script>
    var pathSegmentsToKeep = 0;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  <\/script>
</head>
<body></body>
</html>`
  writeFileSync(resolve(DIST, '404.html'), notFoundHtml, 'utf-8')
  console.log('  ✓ 404.html')

  // 7. llms.txt — copy from public if present, else short fallback
  const llmsSrc = resolve(PUBLIC_DIR, 'llms.txt')
  if (existsSync(llmsSrc)) {
    copyFileSync(llmsSrc, resolve(DIST, 'llms.txt'))
    console.log('  ✓ llms.txt')
  }

  // 8. llms-full.txt — full prose dump
  writeFileSync(resolve(DIST, 'llms-full.txt'), generateLlmsFull(posts), 'utf-8')
  console.log('  ✓ llms-full.txt')

  console.log('\nStatic site generated successfully.')
}

main().catch(err => { console.error(err); process.exit(1) })
