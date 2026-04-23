import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogList() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState(null)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jacobcdsmith.github.io'

  useEffect(() => {
    fetch('/blog/posts.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(setPosts)
      .catch(e => setError(e.message))
  }, [])

  return (
    <section id="blog" >
      <Helmet>
        <title>Blog | Jacob C. Smith — Data Analyst &amp; AI Systems Builder</title>
        <meta name="description" content="Essays and research notes on consciousness, AI systems, data analysis, and the philosophy of complex systems — by Jacob C. Smith." />
        <meta property="og:title" content="Blog — Jacob C. Smith" />
        <meta property="og:description" content="Essays on consciousness, AI, and systems theory." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/blog`} />
        <link rel="canonical" href={`${baseUrl}/blog`} />
      </Helmet>

      <div className="panel-header">
        <h2><span className="prompt">$</span> ls blog/</h2>
      </div>
      <div className="panel-content">
        {error && <p className="blog-error">Could not load posts. ({error})</p>}
        {!posts && !error && <div className="blog-loading">Loading posts…</div>}
        {posts && (
          <div className="blog-list">
            {posts.length === 0 && <p className="blog-empty">No posts yet.</p>}
            {posts.map(post => (
              <article key={post.slug} className="blog-card">
                <div className="blog-card-meta">
                  <time className="blog-date" dateTime={post.date}>{formatDate(post.date)}</time>
                  <div className="blog-tags">
                    {(Array.isArray(post.tags) ? post.tags : []).map(t => <span key={t} className="blog-tag">{t}</span>)}
                  </div>
                </div>
                <h3 className="blog-card-title">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="blog-read-more">read more →</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
