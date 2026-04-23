/**
 * generate-blog-pages.mjs
 *
 * Post-build script that generates:
 *  1. dist/blog/<slug>/index.html  — fully pre-rendered, SEO-ready blog post pages
 *  2. dist/sitemap.xml             — XML sitemap for all crawlable URLs
 *  3. dist/robots.txt              — robots directives
 *  4. dist/404.html                — GitHub Pages SPA redirect (copy of index.html)
 *
 * Run automatically after `vite build` via the "build" npm script.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { marked } from 'marked'

// Strip raw HTML from markdown to prevent XSS from inline HTML in .md files
marked.use({ renderer: { html() { return '' } } })

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')
const DIST      = resolve(ROOT, 'dist')
const BLOG_DIR  = resolve(ROOT, 'blog')

// ─── Helpers ────────────────────────────────────────────────────────────────

function readJson(path)   { return JSON.parse(readFileSync(path, 'utf-8')) }
function readText(path)   { return readFileSync(path, 'utf-8') }

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const BASE_URL = 'https://jacobcdsmith.github.io'

// We inline only the styles needed for the static blog page to render
// correctly even without the React bundle loading.
function blogPostHtml({ title, excerpt, date, slug, tags = [], htmlContent }) {
  const canonical = `${BASE_URL}/blog/${slug}/`
  const dateIso   = date
  const dateFmt   = formatDate(date)
  const tagsMeta  = tags.map(t =>
    `  <meta property="article:tag" content="${escHtml(t)}" />`
  ).join('\n')

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: excerpt,
    datePublished: dateIso,
    author: { '@type': 'Person', name: 'Jacob C. Smith', url: BASE_URL },
    publisher: { '@type': 'Person', name: 'Jacob C. Smith' },
    url: canonical,
    keywords: tags.join(', '),
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)} | Jacob C. Smith</title>
  <meta name="description" content="${escHtml(excerpt)}" />
  <meta name="author" content="Jacob C. Smith" />
  <meta name="keywords" content="${escHtml(tags.join(', '))}" />

  <!-- Open Graph -->
  <meta property="og:title"            content="${escHtml(title)}" />
  <meta property="og:description"      content="${escHtml(excerpt)}" />
  <meta property="og:type"             content="article" />
  <meta property="og:url"              content="${canonical}" />
  <meta property="og:site_name"        content="Jacob C. Smith" />
  <meta property="article:published_time" content="${dateIso}" />
  <meta property="article:author"      content="Jacob C. Smith" />
${tagsMeta}

  <!-- Twitter Card -->
  <meta name="twitter:card"            content="summary" />
  <meta name="twitter:title"           content="${escHtml(title)}" />
  <meta name="twitter:description"     content="${escHtml(excerpt)}" />

  <link rel="canonical" href="${canonical}" />

  <!-- Structured data -->
  <script type="application/ld+json">${jsonLd}</script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    /* ── Reset & base ─────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:        #0d0b0e;
      --bg-alt:    #13111a;
      --surface:   #1a1520;
      --text:      #e8e4ec;
      --dim:       #9a8fa6;
      --primary:   #c9485b;
      --secondary: #b8a9c9;
      --accent:    #7d9f7a;
      --border:    #2d2538;
      --mono:      'Courier New', Courier, monospace;
      --sans:      'Inter', system-ui, sans-serif;
    }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--mono);
      background: linear-gradient(135deg, var(--bg) 0%, #120f18 50%, var(--bg) 100%);
      background-attachment: fixed;
      color: var(--text);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }
    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ::selection { background: var(--primary); color: var(--bg); }

    /* ── Top bar ──────────────────────────────────────────────── */
    .blog-topbar {
      position: sticky; top: 0; z-index: 100;
      background: rgba(13,11,14,.9);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(12px);
      display: flex; align-items: center; gap: 1.5rem;
      padding: .75rem 2rem;
    }
    .blog-topbar a { color: var(--dim); font-size: .85rem; transition: color .2s; }
    .blog-topbar a:hover { color: var(--primary); text-decoration: none; }
    .blog-topbar .sep { color: var(--border); }

    /* ── Main content ─────────────────────────────────────────── */
    .blog-wrap {
      max-width: 780px; margin: 0 auto;
      padding: 3rem 1.5rem 5rem;
    }

    /* ── Post header ──────────────────────────────────────────── */
    .post-header { margin-bottom: 2.5rem; }
    .post-header h1 {
      font-family: var(--sans); font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: 700; color: var(--text); line-height: 1.25;
      margin-bottom: 1rem;
    }
    .post-header h1::before { content: '# '; color: var(--primary); }
    .post-meta { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; }
    .post-date { color: var(--dim); font-size: .85rem; }
    .blog-tag {
      background: rgba(201,72,91,.15); color: var(--primary);
      border: 1px solid rgba(201,72,91,.3);
      border-radius: 4px; padding: .15rem .55rem; font-size: .75rem;
    }

    /* ── Article prose ────────────────────────────────────────── */
    .blog-prose {
      border-top: 1px solid var(--border);
      padding-top: 2rem;
    }
    .blog-prose h1,
    .blog-prose h2,
    .blog-prose h3,
    .blog-prose h4 {
      font-family: var(--sans); color: var(--text);
      margin: 2rem 0 .8rem;
    }
    .blog-prose h2 { font-size: 1.4rem; }
    .blog-prose h2::before { content: '## '; color: var(--primary); }
    .blog-prose h3 { font-size: 1.15rem; }
    .blog-prose h3::before { content: '### '; color: var(--secondary); }
    .blog-prose p  { margin-bottom: 1.25rem; }
    .blog-prose em { color: var(--secondary); font-style: italic; }
    .blog-prose strong { color: var(--text); font-weight: 600; }
    .blog-prose ul,
    .blog-prose ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
    .blog-prose li { margin-bottom: .4rem; }
    .blog-prose a  { color: var(--primary); }
    .blog-prose hr {
      border: none; border-top: 1px solid var(--border);
      margin: 2rem 0;
    }
    .blog-prose code {
      font-family: var(--mono); font-size: .875em;
      background: var(--surface); color: var(--accent);
      border: 1px solid var(--border); border-radius: 4px;
      padding: .15em .35em;
    }
    .blog-prose pre {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; padding: 1.25rem 1.5rem;
      overflow-x: auto; margin-bottom: 1.5rem;
    }
    .blog-prose pre code {
      background: transparent; border: none; padding: 0;
      color: var(--text); font-size: .875rem; line-height: 1.6;
    }
    .blog-prose table {
      width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;
      font-size: .875rem;
    }
    .blog-prose th,
    .blog-prose td {
      border: 1px solid var(--border); padding: .5rem .75rem;
      text-align: left;
    }
    .blog-prose th { background: var(--surface); color: var(--secondary); }
    .blog-prose blockquote {
      border-left: 3px solid var(--primary);
      padding-left: 1rem; margin: 1.5rem 0;
      color: var(--dim); font-style: italic;
    }

    /* ── Footer ───────────────────────────────────────────────── */
    .blog-footer {
      text-align: center; padding: 2rem;
      color: var(--dim); font-size: .8rem;
      border-top: 1px solid var(--border);
    }
  </style>
</head>
<body>

  <nav class="blog-topbar" aria-label="Blog navigation">
    <a href="${BASE_URL}/">⌘ Jacob C. Smith</a>
    <span class="sep">›</span>
    <a href="${BASE_URL}/blog">Blog</a>
    <span class="sep">›</span>
    <span style="color:var(--text)">${escHtml(title)}</span>
  </nav>

  <div class="blog-wrap">
    <header class="post-header">
      <h1>${escHtml(title)}</h1>
      <div class="post-meta">
        <time class="post-date" datetime="${dateIso}">${dateFmt}</time>
        ${tags.map(t => `<span class="blog-tag">${escHtml(t)}</span>`).join('\n        ')}
      </div>
    </header>

    <div class="blog-prose">
      ${htmlContent}
    </div>
  </div>

  <footer class="blog-footer">
    <p>&copy; ${new Date().getFullYear()} Jacob C. Smith &mdash; <a href="${BASE_URL}/">jacobcdsmith.github.io</a></p>
  </footer>

</body>
</html>`
}

// ─── Sitemap ─────────────────────────────────────────────────────────────────

function generateSitemap(posts) {
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: `${BASE_URL}/`,           priority: '1.0', changefreq: 'monthly' },
    { url: `${BASE_URL}/about`,      priority: '0.9', changefreq: 'monthly' },
    { url: `${BASE_URL}/skills`,     priority: '0.7', changefreq: 'monthly' },
    { url: `${BASE_URL}/projects`,   priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE_URL}/experience`, priority: '0.7', changefreq: 'monthly' },
    { url: `${BASE_URL}/contact`,    priority: '0.6', changefreq: 'yearly'  },
    { url: `${BASE_URL}/blog`,       priority: '0.9', changefreq: 'weekly',  lastmod: today },
  ]

  const postEntries = posts.map(p => ({
    url:        `${BASE_URL}/blog/${p.slug}/`,
    lastmod:    p.date,
    priority:   '0.8',
    changefreq: 'yearly',
  }))

  const allPages = [...staticPages, ...postEntries]

  const items = allPages.map(p => `
  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const posts = readJson(resolve(BLOG_DIR, 'posts.json'))

  // 1. Generate individual blog post pages
  for (const post of posts) {
    const mdPath   = resolve(BLOG_DIR, 'posts', `${post.slug}.md`)
    const markdown = readText(mdPath)
    const html     = marked.parse(markdown)

    const outDir  = resolve(DIST, 'blog', post.slug)
    mkdirSync(outDir, { recursive: true })

    const page = blogPostHtml({
      title:       post.title,
      excerpt:     post.excerpt,
      date:        post.date,
      slug:        post.slug,
      tags:        post.tags || [],
      htmlContent: html,
    })

    writeFileSync(resolve(outDir, 'index.html'), page, 'utf-8')
    console.log(`  ✓ blog/${post.slug}/index.html`)
  }

  // 2b. Static blog list page (dist/blog/index.html) — crawlable entry point
  const blogListHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Blog | Jacob C. Smith — Data Analyst &amp; AI Systems Builder</title>
  <meta name="description" content="Essays and research notes on consciousness, AI systems, data analysis, and the philosophy of complex systems — by Jacob C. Smith." />
  <meta name="author" content="Jacob C. Smith" />
  <meta property="og:title" content="Blog — Jacob C. Smith" />
  <meta property="og:description" content="Essays on consciousness, AI, and systems theory." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${BASE_URL}/blog" />
  <link rel="canonical" href="${BASE_URL}/blog" />
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Jacob C. Smith — Blog',
    url: `${BASE_URL}/blog`,
    author: { '@type': 'Person', name: 'Jacob C. Smith', url: BASE_URL },
    blogPost: posts.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      description: p.excerpt,
      url: `${BASE_URL}/blog/${p.slug}/`,
    })),
  })}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0d0b0e; --bg-alt: #13111a; --surface: #1a1520;
      --text: #e8e4ec; --dim: #9a8fa6; --primary: #c9485b;
      --secondary: #b8a9c9; --accent: #7d9f7a; --border: #2d2538;
      --mono: 'Courier New', Courier, monospace; --sans: 'Inter', system-ui, sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { font-family: var(--mono); background: linear-gradient(135deg, var(--bg) 0%, #120f18 50%, var(--bg) 100%); background-attachment: fixed; color: var(--text); line-height: 1.7; -webkit-font-smoothing: antialiased; min-height: 100vh; }
    a { color: var(--primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    ::selection { background: var(--primary); color: var(--bg); }
    .blog-topbar { position: sticky; top: 0; z-index: 100; background: rgba(13,11,14,.9); border-bottom: 1px solid var(--border); backdrop-filter: blur(12px); display: flex; align-items: center; gap: 1.5rem; padding: .75rem 2rem; }
    .blog-topbar a { color: var(--dim); font-size: .85rem; transition: color .2s; }
    .blog-topbar a:hover { color: var(--primary); text-decoration: none; }
    .sep { color: var(--border); }
    .wrap { max-width: 780px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }
    .page-title { font-family: var(--sans); font-size: 1.8rem; font-weight: 700; color: var(--text); margin-bottom: 2rem; }
    .page-title::before { content: '$ ls blog/'; display: block; font-family: var(--mono); font-size: 1rem; color: var(--primary); margin-bottom: .5rem; }
    .blog-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 1.75rem 2rem; margin-bottom: 1.5rem; transition: border-color .2s, transform .2s; }
    .blog-card:hover { border-color: var(--primary); transform: translateY(-2px); }
    .blog-card-meta { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; margin-bottom: .75rem; }
    .blog-date { color: var(--dim); font-size: .8rem; }
    .blog-tag { background: rgba(201,72,91,.15); color: var(--primary); border: 1px solid rgba(201,72,91,.3); border-radius: 4px; padding: .1rem .45rem; font-size: .72rem; }
    .blog-card h2 { font-family: var(--sans); font-size: 1.2rem; font-weight: 600; color: var(--text); margin-bottom: .6rem; }
    .blog-card h2 a { color: var(--text); }
    .blog-card h2 a:hover { color: var(--primary); text-decoration: none; }
    .blog-excerpt { color: var(--dim); font-size: .9rem; margin-bottom: 1rem; }
    .read-more { color: var(--primary); font-size: .85rem; }
    .blog-footer { text-align: center; padding: 2rem; color: var(--dim); font-size: .8rem; border-top: 1px solid var(--border); }
  </style>
</head>
<body>
  <nav class="blog-topbar" aria-label="Blog navigation">
    <a href="${BASE_URL}/">⌘ Jacob C. Smith</a>
    <span class="sep">›</span>
    <span style="color:var(--text)">Blog</span>
  </nav>
  <div class="wrap">
    <div class="page-title">Blog</div>
    ${posts.map(p => `
    <article class="blog-card">
      <div class="blog-card-meta">
        <time class="blog-date" datetime="${p.date}">${formatDate(p.date)}</time>
        ${(p.tags || []).map(t => `<span class="blog-tag">${escHtml(t)}</span>`).join(' ')}
      </div>
      <h2><a href="${BASE_URL}/blog/${p.slug}/">${escHtml(p.title)}</a></h2>
      <p class="blog-excerpt">${escHtml(p.excerpt)}</p>
      <a href="${BASE_URL}/blog/${p.slug}/" class="read-more">read more →</a>
    </article>`).join('\n    ')}
  </div>
  <footer class="blog-footer">
    <p>&copy; ${new Date().getFullYear()} Jacob C. Smith &mdash; <a href="${BASE_URL}/">jacobcdsmith.github.io</a></p>
  </footer>
</body>
</html>`

  // dist/blog/index.html already exists as a directory (from individual post dirs),
  // so we write to dist/blog/index.html directly (it won't conflict with subdirectories)
  writeFileSync(resolve(DIST, 'blog', 'index.html'), blogListHtml, 'utf-8')
  console.log('  ✓ blog/index.html (static list)')

  // 3. Sitemap
  writeFileSync(resolve(DIST, 'sitemap.xml'), generateSitemap(posts), 'utf-8')
  console.log('  ✓ sitemap.xml')

  // 4. robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`
  writeFileSync(resolve(DIST, 'robots.txt'), robots, 'utf-8')
  console.log('  ✓ robots.txt')

  // 5. 404.html — GitHub Pages redirect trick for BrowserRouter
  //    When GitHub Pages serves a 404, it sends this page, which converts the
  //    current URL path/query/hash into a query-string format and redirects
  //    to the SPA root (index.html), which then restores the URL.
  //    Reference: https://github.com/rafgraph/spa-github-pages
  const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Jacob C. Smith</title>
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

  // 6. Copy blog data files so the React SPA can fetch them at runtime
  //    The SPA fetches /blog/posts.json and /blog/posts/<slug>.md
  copyFileSync(resolve(BLOG_DIR, 'posts.json'), resolve(DIST, 'blog', 'posts.json'))
  console.log('  ✓ blog/posts.json (data)')
  const postsDataDir = resolve(DIST, 'blog', 'posts')
  mkdirSync(postsDataDir, { recursive: true })
  for (const file of readdirSync(resolve(BLOG_DIR, 'posts'))) {
    if (file.endsWith('.md')) {
      copyFileSync(resolve(BLOG_DIR, 'posts', file), resolve(postsDataDir, file))
    }
  }
  console.log('  ✓ blog/posts/*.md (data)')

  console.log('\nBlog pages generated successfully.')
}

main().catch(err => { console.error(err); process.exit(1) })
