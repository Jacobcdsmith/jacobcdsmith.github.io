import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { marked } from 'marked'

// Strip raw HTML from markdown to prevent XSS from inline HTML in .md files
marked.use({ renderer: { html() { return '' } } })

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta]       = useState(null)
  const [content, setContent] = useState(null)
  const [error, setError]     = useState(null)

  useEffect(() => {
    // Load post metadata from manifest
    fetch('/blog/posts.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(posts => {
        const found = posts.find(p => p.slug === slug)
        setMeta(found || null)
      })
      .catch(e => setError(`Failed to load posts: ${e.message}`))

    // Load markdown content
    fetch(`/blog/posts/${slug}.md`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text() })
      .then(md => setContent(marked.parse(md)))
      .catch(e => setError(e.message))
  }, [slug])

  if (error) {
    return (
      <section id="blog-post" >
        <div className="panel-content">
          <p className="blog-error">Could not load post. ({error})</p>
          <Link to="/blog" className="blog-back-btn">← back to posts</Link>
        </div>
      </section>
    )
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jacobcdsmith.github.io'
  const canonicalUrl = `${baseUrl}/blog/${slug}/`

  return (
    <section id="blog-post" >
      {meta && (
        <Helmet>
          <title>{meta.title} | Jacob C. Smith</title>
          <meta name="description" content={meta.excerpt} />
          <meta name="author" content="Jacob C. Smith" />
          <meta property="og:title" content={meta.title} />
          <meta property="og:description" content={meta.excerpt} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="article:published_time" content={meta.date} />
          <meta property="article:author" content="Jacob C. Smith" />
          {meta.tags && meta.tags.map(t => (
            <meta key={t} property="article:tag" content={t} />
          ))}
          <link rel="canonical" href={canonicalUrl} />
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: meta.title,
            description: meta.excerpt,
            datePublished: meta.date,
            author: {
              '@type': 'Person',
              name: 'Jacob C. Smith',
              url: 'https://jacobcdsmith.github.io',
            },
            publisher: {
              '@type': 'Person',
              name: 'Jacob C. Smith',
            },
            url: canonicalUrl,
            keywords: meta.tags ? meta.tags.join(', ') : '',
          })}</script>
        </Helmet>
      )}

      <div className="panel-content">
        <button className="blog-back-btn" onClick={() => navigate('/blog')}>
          <span>←</span> back to posts
        </button>

        {!content && !error && <div className="blog-loading">Loading post…</div>}

        {content && (
          <article
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  )
}
