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
              <p className="hero-eyebrow">Industrial systems · Agent stacks · {profile.location}</p>
              <h1 className="hero-title">
                I build <span className="accent">industrial systems</span> and dissect AI agent stacks.
              </h1>
              <p className="hero-sub">
                Industrial systems engineer at <strong>Readyfuels</strong> shipping the WVRTP facility
                inspection system, while building and red-teaming agent stacks — the{' '}
                <strong>Hermes plugin</strong> for Nous Research, <strong>JCLAW</strong>, and{' '}
                <strong>MCPStarfleetCommand</strong>. Embedded/edge work on ESP32-S3 and UNIHIKER.
              </p>

              <div className="hero-actions">
                <Button to="/contact" variant="primary" size="lg" trackName="hero_cta_hire">
                  Work with me
                </Button>
                <Button to="/experience" variant="ghost" size="lg" trackName="hero_cta_experience">
                  See experience
                </Button>
                <CVDownload variant="ghost" size="lg" />
              </div>

              <div className="hero-meta">
                <span className="hero-meta-item">
                  <span aria-hidden="true">●</span> Open to remote Data / BI / Jr Data Engineer roles ($70K+)
                </span>
                <span className="hero-meta-item">
                  <span aria-hidden="true">›</span> React · TypeScript · Python · MCP · ESP-IDF
                </span>
              </div>
            </div>

            <aside className="hero-card" aria-label="What I focus on">
              <p className="hero-card-title">Three things I do</p>
              <div className="hero-pillars">
                <Link to="/services#industrial-operations-tooling" className="hero-pillar">
                  <span className="hero-pillar-label">Industrial / operations tooling</span>
                  <span className="hero-pillar-text">WVRTP-style web apps, QR + Power Automate, Excel systems.</span>
                  <span className="hero-pillar-link">→ services</span>
                </Link>
                <Link to="/services#agent-and-ai-systems" className="hero-pillar">
                  <span className="hero-pillar-label">Agent &amp; AI systems</span>
                  <span className="hero-pillar-text">Hermes, JCLAW, MCP infrastructure — built and red-teamed.</span>
                  <span className="hero-pillar-link">→ services</span>
                </Link>
                <Link to="/services#embedded-and-edge-integration" className="hero-pillar">
                  <span className="hero-pillar-label">Embedded &amp; edge</span>
                  <span className="hero-pillar-text">ESP32-S3 in C, UNIHIKER K10/M10 SDK work.</span>
                  <span className="hero-pillar-link">→ services</span>
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
            <strong>{profile.name}</strong> is a systems engineer and AI systems builder based in{' '}
            {profile.location}. Currently shipping the WVRTP facility inspection system for{' '}
            <strong>Readyfuels</strong>, the <strong>Hermes plugin</strong> for{' '}
            <strong>Nous Research</strong>, and the <strong>JCLAW</strong> /{' '}
            <strong>MCPStarfleetCommand</strong> agent + MCP infrastructure stack. Embedded work on
            ESP32-S3 and UNIHIKER K10/M10. NewForce Cohort 11 graduate; actively targeting remote
            Data Analyst / BI / Junior Data Engineer roles at $70K+.
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
        lead="Notes on agent stacks, MCP infrastructure, local-first AI, decision systems, and the practice of building."
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
