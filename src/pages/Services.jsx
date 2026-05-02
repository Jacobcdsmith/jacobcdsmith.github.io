import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Button from '../components/Button.jsx'
import FAQ from '../components/FAQ.jsx'
import CTABanner from '../components/CTABanner.jsx'
import Quote from '../components/Quote.jsx'
import services from '../data/services.js'
import profile from '../data/profile.js'
import { servicesFaq } from '../data/faq.js'
import testimonials from '../data/testimonials.json'
import {
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from '../lib/structured-data.js'

export default function Services() {
  return (
    <>
      <SEO
        title="Services"
        description="Operational analytics, AI red-teaming, local-first AI systems, and decision-architecture audits — scoped engagements with clear deliverables."
        path="/services"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'Services', url: `${profile.siteUrl}/services` },
          ]),
          ...services.map(serviceSchema),
          faqSchema(servicesFaq),
        ]}
      />

      <header className="page-intro">
        <div className="container">
          <p className="page-eyebrow">Services</p>
          <h1 className="page-title">Engagements that ship.</h1>
          <p className="page-lead">
            Four ways I work with teams. Each one is scoped, time-bound, and produces an artifact
            your team owns. Discovery calls are free; NDAs welcome.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              Operational analytics, AI red-teaming, local-first AI systems, and decision-architecture
              audits. Most engagements are 2–4 weeks with optional retainer.
            </p>
          </aside>
          <div className="hero-actions">
            <Button href={`mailto:${profile.email}`} variant="primary" size="lg" trackName="services_cta_email">
              Start a conversation
            </Button>
            <Button href="#faq" variant="ghost" size="lg">
              Pricing &amp; FAQ
            </Button>
          </div>
        </div>
      </header>

      <Section eyebrow="Offerings" title="What I do">
        {services.map(s => (
          <article key={s.slug} id={s.slug} className="service-card">
            <h3>{s.title}</h3>
            <p className="service-summary">{s.summary}</p>
            <p className="service-forwho">
              <strong>For:</strong> {s.forWho}
            </p>
            <div className="service-grid">
              <div>
                <h4>Deliverables</h4>
                <ul>
                  {s.deliverables.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>Process</h4>
                <ul>
                  {s.process.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </Section>

      <Section
        eyebrow="What clients say"
        title="Selected feedback"
        lead="Placeholders ready for real quotes as engagements complete."
        tone="muted"
      >
        <div className="card-grid card-grid-3">
          {testimonials.map((t, i) => (
            <Quote key={i} {...t} />
          ))}
        </div>
      </Section>

      <Section
        id="faq"
        eyebrow="FAQ"
        title="Pricing &amp; logistics"
        lead="Quick answers to the things I get asked most."
        tone="muted"
      >
        <FAQ items={servicesFaq} defaultOpen={0} />
        <div style={{ marginTop: '2.5rem' }}>
          <CTABanner
            title="Ready to scope something?"
            body="Email is the fastest way. One paragraph about the problem is enough."
            primary={{ label: 'Email Jacob', href: `mailto:${profile.email}`, track: 'services_cta_email_bottom' }}
            secondary={{ label: 'About me', to: '/about', track: 'services_cta_about' }}
          />
        </div>
      </Section>
    </>
  )
}
