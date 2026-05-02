import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import NewsletterForm from '../components/NewsletterForm.jsx'
import { posts, allTags } from '../data/posts.js'
import profile from '../data/profile.js'
import { breadcrumbSchema, websiteSchema } from '../lib/structured-data.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialTag = searchParams.get('tag') || ''
  const [query, setQuery] = useState(initialQuery)
  const [activeTag, setActiveTag] = useState(initialTag)
  const tags = allTags()

  const updateQuery = q => {
    setQuery(q)
    const next = new URLSearchParams(searchParams)
    if (q) next.set('q', q)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const setTag = t => {
    setActiveTag(t)
    const next = new URLSearchParams(searchParams)
    if (t) next.set('tag', t)
    else next.delete('tag')
    setSearchParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(p => {
      if (activeTag && !p.tags.includes(activeTag)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.markdown || '').toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    })
  }, [query, activeTag])

  const featured = posts[0]
  const showFeatured = !query && !activeTag && featured
  const list = showFeatured ? filtered.slice(1) : filtered

  return (
    <>
      <SEO
        title="Blog"
        description="Long-form writing on consciousness modeling, local-first AI, decision systems, and the practice of building."
        path="/blog"
        jsonLd={[
          websiteSchema(),
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'Blog', url: `${profile.siteUrl}/blog` },
          ]),
        ]}
      />

      <header className="page-intro">
        <div className="container">
          <p className="page-eyebrow">Writing</p>
          <h1 className="page-title">The blog.</h1>
          <p className="page-lead">
            Notes from the practice — consciousness modeling, local-first AI, decision systems, and
            the slow craft of shipping useful things.
          </p>
        </div>
      </header>

      <Section>
        <div className="blog-toolbar">
          <input
            type="search"
            className="search-input"
            placeholder="Search posts…"
            value={query}
            onChange={e => updateQuery(e.target.value)}
            aria-label="Search blog posts"
          />
          {tags.length > 0 && (
            <div className="tag-filter" role="group" aria-label="Filter by tag">
              <button
                type="button"
                onClick={() => setTag('')}
                className={!activeTag ? 'is-active' : ''}
              >
                all
              </button>
              {tags.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t === activeTag ? '' : t)}
                  className={activeTag === t ? 'is-active' : ''}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {showFeatured && featured && (
          <Link to={`/blog/${featured.slug}`} className="featured-post">
            <span className="featured-eyebrow">Featured</span>
            <h2 className="featured-title">{featured.title}</h2>
            <p className="featured-excerpt">{featured.excerpt}</p>
            <p className="featured-meta">
              {formatDate(featured.date)} · {featured.readingTime} min read
            </p>
          </Link>
        )}

        {list.length === 0 ? (
          <div className="empty-state">
            No posts match your search. Try a different term or clear the tag filter.
          </div>
        ) : (
          <div className="post-list">
            {list.map(p => (
              <article key={p.slug} className="post-card">
                <div className="post-card-meta">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span>·</span>
                  <span>{p.readingTime} min read</span>
                </div>
                <h3 className="post-card-title">
                  <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                </h3>
                <p className="post-card-excerpt">{p.excerpt}</p>
                {p.tags.length > 0 && (
                  <div className="post-card-tags">
                    {p.tags.map(t => (
                      <Tag key={t} tone="neutral">{t}</Tag>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div style={{ marginTop: '3rem' }} className="newsletter-footer">
          <NewsletterForm
            heading="Get new posts by email"
            sub="Roughly monthly. No spam, unsubscribe anytime."
          />
        </div>
      </Section>
    </>
  )
}
