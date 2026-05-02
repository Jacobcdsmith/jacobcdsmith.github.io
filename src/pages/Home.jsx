import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Button from '../components/Button.jsx'
import CVDownload from '../components/CVDownload.jsx'
import FAQ from '../components/FAQ.jsx'
import Quote from '../components/Quote.jsx'
import CTABanner from '../components/CTABanner.jsx'
import NewsletterForm from '../components/NewsletterForm.jsx'
import Tag from '../components/Tag.jsx'
import profile from '../data/profile.js'
import services from '../data/services.js'
import testimonials from '../data/testimonials.json'
import { homeFaq } from '../data/faq.js'
import { posts } from '../data/posts.js'
import {
  personSchema,
  professionalServiceSchema,
  websiteSchema,
  faqSchema,
} from '../lib/structured-data.js'

export default function Home() {
  const recentPosts = posts.slice(0, 3)

  return (
    <>
      <SEO
        title={null}
        description={`${profile.name}, ${profile.role} based in ${profile.location}. ${profile.subtagline}`}
        path="/"
        jsonLd={[
          personSchema(),
          professionalServiceSchema(),
          websiteSchema(),
          faqSchema(homeFaq),
        ]}
      />

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <p className="hero-eyebrow">Independent practice · {profile.location}</p>
              <h1 className="hero-title">
                I help teams turn messy reality into <span className="accent">measurable systems</span>.
              </h1>
              <p className="hero-sub">
                For <strong>clients</strong> who need analytics or AI tooling that ships, for{' '}
                <strong>peers</strong> who want the writing, and for{' '}
                <strong>curious visitors</strong> who just want a tour.
              </p>

              <div className="hero-actions">
                <Button to="/contact" variant="primary" size="lg" trackName="hero_cta_hire">
                  Work with me
                </Button>
                <Button to="/blog" variant="ghost" size="lg" trackName="hero_cta_blog">
                  Read the writing
                </Button>
                <CVDownload variant="ghost" size="lg" />
              </div>

              <div className="hero-meta">
                <span className="hero-meta-item">
                  <span aria-hidden="true">●</span> Available for engagements
                </span>
                <span className="hero-meta-item">
                  <span aria-hidden="true">›</span> SQL · Python · LLM systems · BI · MCP · ESP-IDF
                </span>
              </div>
            </div>

            <aside className="hero-card" aria-label="What I focus on">
              <p className="hero-card-title">Three things I do</p>
              <div className="hero-pillars">
                <Link to="/services#analytics-engagements" className="hero-pillar">
                  <span className="hero-pillar-label">Operational analytics</span>
                  <span className="hero-pillar-text">Dashboards, forecasts, and KPI / safety formula systems you can defend.</span>
                  <span className="hero-pillar-link">→ services</span>
                </Link>
                <Link to="/services#ai-red-teaming" className="hero-pillar">
                  <span className="hero-pillar-label">AI red-teaming</span>
                  <span className="hero-pillar-text">Find the failure modes before launch. (See: Hermes red-team subagent.)</span>
                  <span className="hero-pillar-link">→ services</span>
                </Link>
                <Link to="/projects" className="hero-pillar">
                  <span className="hero-pillar-label">Local-first AI tools</span>
                  <span className="hero-pillar-text">JCLAW, MCPStarfleetCommand, local WebSocket MCP gateway.</span>
                  <span className="hero-pillar-link">→ projects</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* TL;DR / answer block for AEO + audience grid */}
      <Section tone="muted">
        <aside className="answer-box">
          <p className="answer-box-label">TL;DR</p>
          <p>
            <strong>{profile.name}</strong> is an independent systems engineer, AI red-teamer, and
            consciousness researcher based in {profile.location}. I take three kinds of work:
            operational analytics engagements, AI red-teaming and safety reviews, and local-first
            AI system design. Currently shipping the WVRTP facility inspection system for{' '}
            <strong>Readyfuels</strong> and the Hermes plugin for <strong>Nous Research</strong>;
            ongoing open research on consciousness modeling (EMERGENT-MCF-EI), the JCLAW agentic
            runtime, and embedded work on ESP32-S3 / UNIHIKER K10.
          </p>
        </aside>

        <div className="audience-grid">
          {profile.audiences.map(a => (
            <Link key={a.key} to={a.cta.href} className="audience-card">
              <span className="audience-label">{a.label}</span>
              <p className="audience-blurb">{a.blurb}</p>
              <span className="card-link">{a.cta.label} →</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Services preview */}
      <Section
        eyebrow="Services"
        title="Four ways I work with teams"
        lead="Scoped engagements with clear deliverables. Discovery calls are free."
      >
        <div className="card-grid card-grid-3">
          {services.map(s => (
            <Link key={s.slug} to={`/services#${s.slug}`} className="card">
              <h3 className="card-title">{s.title}</h3>
              <p className="card-summary">{s.summary}</p>
              <span className="card-link">Read more →</span>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Button to="/services" variant="ghost" size="md">All services →</Button>
        </div>
      </Section>

      {/* Recent writing */}
      <Section
        eyebrow="Writing"
        title="Recent posts"
        lead="Notes on consciousness modeling, agent stacks, local-first AI, decision systems, and the practice of building."
        tone="muted"
      >
        <div className="post-list">
          {recentPosts.map(p => (
            <article key={p.slug} className="post-card">
              <div className="post-card-meta">
                <span className="post-card-category">{p.category}</span>
                <span>·</span>
                <time dateTime={p.date}>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                <span>·</span>
                <span>{p.readingTime} min read</span>
              </div>
              <h3 className="post-card-title">
                <Link to={`/blog/${p.slug}`}>{p.title}</Link>
              </h3>
              <p className="post-card-excerpt">{p.excerpt}</p>
              {p.tags.length > 0 && (
                <div className="post-card-tags">
                  {p.tags.slice(0, 3).map(t => (
                    <Tag key={t} tone="neutral">{t}</Tag>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Button to="/blog" variant="ghost" size="md">All writing →</Button>
        </div>
      </Section>

      {/* Selected delivery */}
      <Section
        eyebrow="Selected delivery"
        title="Recent shipped work"
        lead="Three engagements from the last six months — what was built, for whom, and when."
      >
        <div className="card-grid card-grid-3">
          {testimonials.map((t, i) => (
            <Quote key={i} {...t} />
          ))}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Button to="/projects" variant="ghost" size="md">See all projects →</Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        id="faq"
        eyebrow="FAQ"
        title="Common questions"
        lead="If your question isn’t here, email is the fastest way."
        tone="muted"
      >
        <FAQ items={homeFaq} defaultOpen={0} />
      </Section>

      {/* Newsletter + CTA */}
      <Section eyebrow="Stay close" title="Subscribe to the newsletter" lead="Occasional notes, slow cadence, no spam.">
        <NewsletterForm
          variant="block"
          sub="Long-form essays roughly monthly. Unsubscribe anytime."
        />
        <div style={{ marginTop: '2.5rem' }}>
          <CTABanner
            primary={{ label: 'Email Jacob', href: `mailto:${profile.email}`, track: 'home_cta_email' }}
            secondary={{ label: 'See services', to: '/services', track: 'home_cta_services' }}
          />
        </div>
      </Section>
    </>
  )
}
