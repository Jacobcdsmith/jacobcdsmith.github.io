import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import NewsletterForm from '../components/NewsletterForm.jsx'
import { posts, allTags, allCategories } from '../data/posts.js'
import profile from '../data/profile.js'
import { breadcrumbSchema, websiteSchema } from '../lib/structured-data.js'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialTag = searchParams.get('tag') || ''
  const initialCategory = searchParams.get('category') || ''
  const [query, setQuery] = useState(initialQuery)
  const [activeTag, setActiveTag] = useState(initialTag)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const tags = allTags()
  const categories = allCategories()

  const updateParams = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }
  const updateQuery = q => { setQuery(q); updateParams('q', q) }
  const setTag = t => { setActiveTag(t); updateParams('tag', t) }
  const setCategory = c => { setActiveCategory(c); updateParams('category', c) }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(p => {
      if (activeCategory && p.category !== activeCategory) return false
      if (activeTag && !p.tags.includes(activeTag)) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.markdown || '').toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
    })
  }, [query, activeTag, activeCategory])

  const featured = posts[0]
  const showFeatured = !query && !activeTag && !activeCategory && featured
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

      <Section eyebrow="In short" title="The TL;DR" tone="muted">
        <div className="answer-box">
          <p className="answer-box-label">TL;DR</p>
          <p>
            Long-form posts by <strong>{profile.name}</strong>, organized into three categories —
            <strong> Research</strong> (consciousness modeling, EMERGENT-MCF-EI, mathematics),
            <strong> Engineering</strong> (local-first AI, runtimes, tooling), and
            <strong> Essays</strong> (systems thinking, decision architecture). Search across post
            text below, or filter by category and tag.
          </p>
        </div>
      </Section>

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
          {categories.length > 0 && (
            <div className="category-filter" role="group" aria-label="Filter by category">
              <span className="filter-label">Category:</span>
              <button
                type="button"
                onClick={() => setCategory('')}
                className={!activeCategory ? 'is-active' : ''}
              >
                All
              </button>
              {categories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c === activeCategory ? '' : c)}
                  className={activeCategory === c ? 'is-active' : ''}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          {tags.length > 0 && (
            <div className="tag-filter" role="group" aria-label="Filter by tag">
              <span className="filter-label">Tag:</span>
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
            <span className="featured-eyebrow">Featured · {featured.category}</span>
            <h2 className="featured-title">{featured.title}</h2>
            <p className="featured-excerpt">{featured.excerpt}</p>
            <p className="featured-meta">
              {formatDate(featured.date)} · {featured.readingTime} min read
            </p>
          </Link>
        )}

        {list.length === 0 ? (
          <div className="empty-state">
            No posts match your search. Try a different term or clear the filters.
          </div>
        ) : (
          <div className="post-list">
            {list.map(p => (
              <article key={p.slug} className="post-card">
                <div className="post-card-meta">
                  <span className="post-card-category">{p.category}</span>
                  <span>·</span>
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
