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
const AVAILABILITY = profile.availability

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
const THEME_BOOTSTRAP_SCRIPT = `<script>(function(){try{var s=localStorage.getItem('jcs-theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();</script>`

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
  ogImage = `${BASE_URL}/og-default.svg`,
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
  <meta name="theme-color" content="#0f0e12" media="(prefers-color-scheme: dark)" />
  <meta name="theme-color" content="#faf7f2" media="(prefers-color-scheme: light)" />

  ${THEME_BOOTSTRAP_SCRIPT}

  <title>${escHtml(fullTitle)}</title>
  <meta name="description" content="${escHtml(description)}" />
  <meta name="author" content="${SITE_NAME}" />
  <link rel="canonical" href="${canonical}" />
  <link rel="alternate" type="application/rss+xml" title="${SITE_NAME} — Blog" href="${BASE_URL}/rss.xml" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

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
    <div class="crawl-only" style="max-width:780px;margin:2rem auto;padding:1.5rem;font-family:Inter,system-ui,sans-serif;color:#ecebe8;background:#0f0e12;">
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
      <aside style="border-left:2px solid #c9485b;background:rgba(201,72,91,0.06);padding:0.9rem 1.15rem;margin:1.25rem 0 1.5rem;border-radius:0 4px 4px 0;max-width:64ch;">
        <p style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:#c9485b;margin:0 0 0.4rem;font-weight:600;">TL;DR</p>
        <p style="margin:0;color:#ecebe8;font-size:0.97rem;line-height:1.6;">${tldr}</p>
      </aside>` : ''
  return `
      <p style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;color:#c9485b;margin:0 0 0.85rem;">${escHtml(eyebrow)}</p>
      <h1 style="font-family:Georgia,serif;font-size:2.5rem;line-height:1.1;margin:0 0 1rem;color:#ecebe8;">${escHtml(title)}</h1>
      <p style="font-size:1.1rem;color:#9a9694;margin:0 0 1.5rem;max-width:60ch;">${escHtml(lead)}</p>
      ${tldrBlock}
      ${body}
      <p style="margin-top:2rem;font-size:0.85rem;color:#9a9694;">
        <a href="/" style="color:#c9485b;">Home</a> ·
        <a href="/about" style="color:#c9485b;">About</a> ·
        <a href="/services" style="color:#c9485b;">Services</a> ·
        <a href="/projects" style="color:#c9485b;">Projects</a> ·
        <a href="/experience" style="color:#c9485b;">Experience</a> ·
        <a href="/blog" style="color:#c9485b;">Blog</a> ·
        <a href="/contact" style="color:#c9485b;">Contact</a>
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
  sameAs: ['https://github.com/Jacobcdsmith', 'https://linkedin.com/in/jacobcsmith'],
  description: PERSON_DESCRIPTION,
}

const profServiceJson = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `${SITE_NAME} — ${ROLE}`,
  url: BASE_URL,
  image: `${BASE_URL}/og-default.svg`,
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
      description: 'Jacob C. Smith — industrial systems engineer and AI systems builder based in Buckhannon, West Virginia. Readyfuels (WVRTP), Hermes plugin for Nous Research, JCLAW, MCPStarfleetCommand, ESP32-S3, UNIHIKER.',
      jsonLd: [personJson, profServiceJson, websiteJson, faqJson(homeFaq)],
      visibleBody: visibleBlock({
        eyebrow: `Industrial systems · Agent stacks · Buckhannon, WV`,
        title: 'I build industrial systems and dissect AI agent stacks.',
        lead: 'Industrial systems engineer at Readyfuels shipping the WVRTP facility inspection system, while building and red-teaming agent stacks — Hermes plugin for Nous Research, JCLAW, and MCPStarfleetCommand. Embedded/edge work on ESP32-S3 and UNIHIKER.',
        tldr: 'Jacob C. Smith is a systems engineer and AI systems builder based in Buckhannon, West Virginia. Currently shipping the WVRTP facility inspection system for Readyfuels, the Hermes plugin for Nous Research, and the JCLAW / MCPStarfleetCommand agent + MCP infrastructure stack. Embedded work on ESP32-S3 and UNIHIKER K10/M10. NewForce Cohort 11 graduate; actively targeting remote Data Analyst / BI / Junior Data Engineer roles at $70K+.',
        body: `
          <p style="margin:1.5rem 0;">
            <a href="/contact" style="color:#c9485b;font-weight:500;">Work with me →</a> &nbsp;
            <a href="/experience" style="color:#c9485b;">See experience →</a> &nbsp;
            <a href="/jacob-c-smith-resume.pdf" style="color:#c9485b;">Download CV →</a>
          </p>
          <h2 style="font-family:Georgia,serif;font-size:1.6rem;margin:2rem 0 0.85rem;color:#ecebe8;">Three things I do</h2>
          <ul style="padding-left:1.2rem;color:#ecebe8;">
            <li><strong>Industrial / operations tooling</strong> — WVRTP-style web apps, QR + Power Automate, Excel formula systems.</li>
            <li><strong>Agent &amp; AI systems</strong> — Hermes plugin, JCLAW, MCP infrastructure, built and red-teamed.</li>
            <li><strong>Embedded &amp; edge</strong> — ESP32-S3 firmware in C, UNIHIKER K10/M10 SDK work.</li>
          </ul>
          <p><a href="/services" style="color:#c9485b;">See all services →</a></p>
        `,
      }),
    },
    {
      path: '/about',
      title: 'About',
      description: 'Jacob C. Smith — industrial systems engineer and AI systems builder spanning industrial → web → AI → embedded. Readyfuels, Nous Research, JCLAW, ESP32-S3, UNIHIKER.',
      jsonLd: [personJson, bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'About', url: `${BASE_URL}/about` }])],
      visibleBody: visibleBlock({
        eyebrow: 'About',
        title: 'Jacob C. Smith.',
        lead: 'Industrial systems engineer and AI systems builder spanning industrial → web → AI → embedded. Based in Buckhannon, West Virginia.',
        tldr: 'Jacob C. Smith is a systems engineer and AI systems builder based in Buckhannon, West Virginia. Industrial work for Readyfuels (WVRTP facility inspection system, 1,135-formula safety + KPI Excel workbook); agent / AI work for Nous Research (Hermes plugin) and on his own stacks (JCLAW, MCPStarfleetCommand, a local WebSocket MCP gateway); embedded / edge work on ESP32-S3 and UNIHIKER K10/M10. NewForce Cohort 11 graduate. Actively targeting remote Data Analyst / BI Analyst / Junior Data Engineer roles ($70K+) in addition to consulting engagements.',
        body: `<p>The industrial work at <strong>Readyfuels</strong> is the anchor — a React/Vite/TypeScript facility inspection system on Vercel with QR-driven capture and Power Automate pipelines, alongside a 1,135-formula safety + KPI Excel workbook. The agent work runs in parallel: the <strong>Hermes plugin</strong> for <strong>Nous Research</strong> (three-subagent stack with persistent SOUL.md identity and OpenRouter routing), plus <strong>JCLAW</strong>, <strong>MCPStarfleetCommand</strong>, and a local WebSocket MCP gateway. The embedded thread is ESP32-S3 in C/ESP-IDF and a UNIHIKER K10 skill package grounded in the actual hardware schematic.</p>
        <p><a href="/jacob-c-smith-resume.pdf" style="color:#c9485b;">Download CV →</a></p>`,
      }),
    },
    {
      path: '/services',
      title: 'Services',
      description: 'Industrial / operations tooling, agent & AI systems, local-first AI systems, and embedded & edge integration — scoped engagements with clear deliverables.',
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
        tldr: 'Industrial / operations tooling (proven on the WVRTP facility inspection system at Readyfuels), agent & AI systems (Hermes plugin for Nous Research), local-first AI systems (JCLAW + MCP infrastructure), and embedded & edge integration (ESP32-S3, UNIHIKER K10/M10). Most engagements are 2–4 weeks with optional retainer.',
        body: `<ul style="padding-left:1.2rem;color:#ecebe8;">
          <li><strong>Industrial / operations tooling</strong> — proof case: <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer" style="color:#c9485b;">Readyfuels</a> (WVRTP facility inspection system).</li>
          <li><strong>Agent &amp; AI systems</strong> — delivery example: <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer" style="color:#c9485b;">Nous Research</a> (Hermes plugin).</li>
          <li><strong>Local-first AI systems</strong> — JCLAW, MCPStarfleetCommand, local WebSocket MCP gateway.</li>
          <li><strong>Embedded &amp; edge integration</strong> — ESP32-S3 firmware in C/ESP-IDF, UNIHIKER K10/M10 SDK work.</li>
        </ul>
        <p>Discovery calls are free. Email <a href="mailto:jacobcsmithd@gmail.com" style="color:#c9485b;">jacobcsmithd@gmail.com</a> to start.</p>`,
      }),
    },
    {
      path: '/projects',
      title: 'Projects',
      description: 'WVRTP facility inspection system (Readyfuels), Hermes plugin (Nous Research), JCLAW, MCPStarfleetCommand, UNIHIKER and ESP32-S3 work, EMERGENT-MCF-EI research.',
      jsonLd: [bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Projects', url: `${BASE_URL}/projects` }])],
      visibleBody: visibleBlock({
        eyebrow: 'Projects',
        title: 'Things I’m building.',
        lead: 'Industrial tooling, agent infrastructure, embedded/edge work, and open research. Ordered roughly by what is most active right now.',
        tldr: 'Flagship work right now: the WVRTP facility inspection system for Readyfuels (React/Vite/TS, Vercel, QR + Power Automate), the Hermes plugin for Nous Research (three-subagent stack with persistent SOUL.md identity), JCLAW + MCPStarfleetCommand + a local WebSocket MCP gateway, ESP32-S3 firmware and a UNIHIKER K10 skill package, plus the ongoing EMERGENT-MCF-EI consciousness-modeling research thread.',
        body: `<ul style="padding-left:1.2rem;color:#ecebe8;">
          <li><strong>WVRTP Facility Inspection System</strong> — React/Vite/TypeScript on Vercel for <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer" style="color:#c9485b;">Readyfuels</a>; QR + Power Automate.</li>
          <li><strong>Hermes plugin</strong> — three-subagent stack with persistent SOUL.md identity for <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer" style="color:#c9485b;">Nous Research</a>.</li>
          <li><strong>JCLAW</strong> — SQLite-backed agentic runtime with multi-provider routing, MCP, branching, evals.</li>
          <li><strong>MCPStarfleetCommand</strong> — dual-transport MCP server.</li>
          <li><strong>Local WebSocket MCP gateway</strong> — cloud dependencies severed by design.</li>
          <li><strong>UNIHIKER K10 skill package</strong> — MicroPython + full C/C++ SDK against the real hardware schematic.</li>
          <li><strong>ESP32-S3 firmware</strong> — modular ESP-IDF / C work with documented module boundaries.</li>
          <li><strong>EMERGENT-MCF-EI</strong> — GPU-accelerated lattice simulation modeling consciousness as a spectral filter.</li>
          <li><strong>jacobcdsmith.github.io</strong> — this site. Static React + Vite SPA with pre-rendered HTML.</li>
          <li><strong>Pro bono</strong> — regional hospitality client (BigCommerce → Clover evaluation), Spark / sparkwv.org (HostGator → Google Workspace migration).</li>
        </ul>`,
      }),
    },
    {
      path: '/experience',
      title: 'Experience',
      description: 'Systems Engineer at Readyfuels (WVRTP), Hermes plugin for Nous Research, JCLAW + MCP infrastructure, ESP32-S3 + UNIHIKER embedded work, EMERGENT-MCF-EI research, NewForce Cohort 11.',
      jsonLd: [bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Experience', url: `${BASE_URL}/experience` }])],
      visibleBody: visibleBlock({
        eyebrow: 'Experience',
        title: 'Selected work.',
        lead: 'A short version of the last six months and what came before. For the long version, download the CV or email for references.',
        tldr: 'Jacob C. Smith is currently Systems Engineer at Readyfuels shipping the WVRTP facility inspection system, alongside agent / AI work (the Hermes plugin for Nous Research, JCLAW, MCPStarfleetCommand) and embedded / edge work (ESP32-S3, UNIHIKER K10/M10). NewForce Cohort 11 graduate; Bridging Innovations Morgantown member. Actively targeting remote Data Analyst / BI Analyst / Junior Data Engineer roles ($70K+) in addition to consulting engagements.',
        body: `<p><a href="/jacob-c-smith-resume.pdf" style="color:#c9485b;">Download CV →</a></p>`,
      }),
    },
    {
      path: '/contact',
      title: 'Contact',
      description: 'Get in touch with Jacob C. Smith. Open to remote Data Analyst / BI Analyst / Junior Data Engineer roles ($70K+) in addition to consulting engagements. Email is the fastest way.',
      jsonLd: [bcrumb([{ name: 'Home', url: BASE_URL }, { name: 'Contact', url: `${BASE_URL}/contact` }])],
      visibleBody: visibleBlock({
        eyebrow: 'Contact',
        title: 'Let’s talk.',
        lead: 'One paragraph about the problem you’re trying to solve is enough to start. Open to remote Data Analyst / BI Analyst / Junior Data Engineer roles ($70K+) in addition to consulting engagements.',
        tldr: `The fastest way to reach ${SITE_NAME} is email (jacobcsmithd@gmail.com) or phone ((304) 473-9980). ${AVAILABILITY} Most consulting engagements start with a free 30-minute discovery call. Based in Buckhannon, West Virginia; works remotely worldwide.`,
        body: `<ul style="padding-left:1.2rem;color:#ecebe8;">
          <li>Email: <a href="mailto:jacobcsmithd@gmail.com" style="color:#c9485b;">jacobcsmithd@gmail.com</a></li>
          <li>Phone: <a href="tel:+13044739980" style="color:#c9485b;">(304) 473-9980</a></li>
          <li>GitHub: <a href="https://github.com/Jacobcdsmith" style="color:#c9485b;">github.com/Jacobcdsmith</a></li>
          <li>LinkedIn: <a href="https://linkedin.com/in/jacobcsmith" style="color:#c9485b;">linkedin.com/in/jacobcsmith</a></li>
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
        body: `<ul style="padding-left:1.2rem;color:#ecebe8;">
          ${posts.map(p => `<li><a href="/blog/${p.slug}/" style="color:#c9485b;">${escHtml(p.title)}</a> — <span style="color:#9a9694;">${formatDate(p.date)}</span></li>`).join('\n          ')}
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
    <p style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;color:#c9485b;margin:0 0 0.85rem;">Blog</p>
    <h1 style="font-family:Georgia,serif;font-size:2.25rem;line-height:1.15;margin:0 0 1rem;color:#ecebe8;">${escHtml(post.title)}</h1>
    <p style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;color:#9a9694;margin:0 0 1.5rem;">${formatDate(post.date)} · ${readingTime(post.markdown)} min read · by Jacob C. Smith</p>
    <p style="font-size:1.1rem;color:#9a9694;margin:0 0 2rem;">${escHtml(post.excerpt)}</p>
    <article style="font-size:1.05rem;line-height:1.75;">${htmlContent}</article>
    <p style="margin-top:2rem;font-size:0.85rem;color:#9a9694;"><a href="/blog" style="color:#c9485b;">← All posts</a></p>
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
      <stop offset="0%" stop-color="#17161c"/>
      <stop offset="100%" stop-color="#0f0e12"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c9485b"/>
      <stop offset="100%" stop-color="#d4a574"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="630" fill="url(#accent)"/>
  <text x="80" y="120" font-family="'JetBrains Mono', monospace" font-size="22" letter-spacing="6" fill="#c9485b">${escHtml(category)} · ${SITE_NAME.toUpperCase()}</text>
  <text font-family="Georgia, 'Fraunces', serif" font-size="68" font-weight="600" fill="#ecebe8">${titleSvg}</text>
  <text x="80" y="560" font-family="'JetBrains Mono', monospace" font-size="20" fill="#9a9694">${escHtml(dateLabel)} · ${readingTime(post.markdown)} min read · by ${SITE_NAME}</text>
  <text x="1120" y="560" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="20" fill="#6a6764">jacobcdsmith.github.io</text>
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
    <description>Long-form writing on consciousness modeling, local-first AI, decision systems, and the practice of building.</description>
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
  out += `Jacob C. Smith is a systems engineer and AI systems builder based in Buckhannon, West Virginia. Currently shipping the WVRTP facility inspection system for Readyfuels (https://readyfuels.com), the Hermes plugin for Nous Research (https://nousresearch.com), and the JCLAW / MCPStarfleetCommand agent + MCP infrastructure stack. Embedded / edge work on ESP32-S3 and UNIHIKER K10/M10. NewForce Cohort 11 graduate; Bridging Innovations Morgantown member.\n\n`
  out += `Practice areas: industrial / operations tooling, agent & AI systems, local-first AI systems, embedded & edge integration. Open research on consciousness modeling (EMERGENT-MCF-EI).\n\n`
  out += `Availability: Actively targeting remote Data Analyst / BI Analyst / Junior Data Engineer roles ($70K+) in addition to consulting engagements.\n\n`
  out += `Contact: jacobcsmithd@gmail.com · (304) 473-9980 · github.com/Jacobcdsmith · linkedin.com/in/jacobcsmith\n\n`
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
