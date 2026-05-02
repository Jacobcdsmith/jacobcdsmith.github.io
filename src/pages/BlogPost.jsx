import { Link, useParams } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import SocialShare from '../components/SocialShare.jsx'
import RelatedPosts from '../components/RelatedPosts.jsx'
import NewsletterForm from '../components/NewsletterForm.jsx'
import AgentGatewaySchematic from '../components/AgentGatewaySchematic.jsx'
import { getPost, getRelatedPosts } from '../data/posts.js'
import profile from '../data/profile.js'
import { blogPostingSchema, breadcrumbSchema } from '../lib/structured-data.js'

// Map of hero figure IDs (from posts.json `hero` field) to React components.
// When a post declares `"hero": "agent-gateway-schematic"`, the matching
// component is rendered above the prose body as an interactive figure.
const HERO_FIGURES = {
  'agent-gateway-schematic': AgentGatewaySchematic,
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <Section>
        <div className="notfound">
          <h1>Post not found</h1>
          <p>That post doesn’t exist (or hasn’t been published yet).</p>
          <Link className="btn btn-primary btn-md" to="/blog">Back to blog</Link>
        </div>
      </Section>
    )
  }

  const related = getRelatedPosts(slug)
  const HeroFigure = post.hero ? HERO_FIGURES[post.hero] : null

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}/`}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
        image={`${profile.siteUrl}/og/${post.slug}.svg`}
        jsonLd={[
          blogPostingSchema(post),
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'Blog', url: `${profile.siteUrl}/blog` },
            { name: post.title, url: `${profile.siteUrl}/blog/${post.slug}/` },
          ]),
        ]}
      />

      <Section>
        <header className="post-header">
          <p className="post-eyebrow">{post.category}</p>
          <h1>{post.title}</h1>
          <p className="excerpt">{post.excerpt}</p>
          <div className="post-byline">
            <img
              src="/avatar.svg"
              alt=""
              width="44"
              height="44"
              className="post-byline-avatar"
              loading="lazy"
            />
            <div className="post-byline-text">
              <span className="post-byline-name">
                By <Link to="/about">{profile.name}</Link>
              </span>
              <span className="post-byline-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                <span>{post.readingTime} min read</span>
              </span>
            </div>
          </div>
          {post.tags.length > 0 && (
            <div className="post-header-tags">
              {post.tags.map(t => (
                <Tag key={t} tone="neutral">{t}</Tag>
              ))}
            </div>
          )}
        </header>

        {HeroFigure && (
          <div className="post-hero-figure">
            <HeroFigure />
          </div>
        )}

        <article
          className="prose"
          // post.html is generated at build/import time from trusted local markdown
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="post-footer">
          <SocialShare url={`/blog/${post.slug}/`} title={post.title} />
          <RelatedPosts posts={related} />
          <div style={{ marginTop: '2.5rem' }} className="newsletter-footer">
            <NewsletterForm
              heading="More like this in your inbox"
              sub="Subscribe for occasional long-form posts."
            />
          </div>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/blog" className="btn btn-ghost btn-md">← All posts</Link>
          </div>
        </div>
      </Section>
    </>
  )
}
