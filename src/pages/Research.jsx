import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import Button from '../components/Button.jsx'
import profile from '../data/profile.js'
import research from '../data/research.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const STATUS_LABEL = {
  'public':      'Public',
  'summary':     'Summary-only · pre-filing',
  'in-revision': 'Summary-only · in revision',
  'on-request':  'On request',
}

const SUMMARY_NOTE = {
  'summary':     'Full text available on request post-filing',
  'in-revision': 'Full text not yet available — in revision',
}

export default function Research() {
  return (
    <>
      <SEO
        title="Research"
        description="First-party research and IP from Jacob C. Smith — Causal Compression Graphs (CCG), Emergent Relational Ontology (ERO), hysteretic computing IP, and multicomputational phase-transition work in quantum-classical hybrid systems."
        path="/research"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'Research', url: `${profile.siteUrl}/research` },
          ]),
        ]}
      />

      <header className="page-intro">
        <div className="container">
          <p className="page-eyebrow">Research</p>
          <h1 className="page-title">First-party research &amp; IP.</h1>
          <p className="page-lead">
            Reference material that sits separate from client work and from the long-form blog:
            theory papers, an ontology framework, and a small portfolio of pre-filing IP. Public
            documents are linked inline. Pre-filing items show only a sanitized summary and are
            available on request once filing is complete. Additional unpublished IP exists and is
            available under NDA.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              One public theory paper — <strong>Causal Compression Graphs</strong>, on how
              reasoning emerges in LLMs through causal-structure discovery. Four summary-only
              items: an in-revision relational ontology (<strong>ERO</strong>) and three pre-filing
              IP items in hardware computing and quantum-classical hybrid systems. Additional
              unpublished IP exists and is available under NDA. Email{' '}
              <a href={`mailto:${profile.email}`}>{profile.email}</a> for post-filing materials or
              NDA access.
            </p>
          </aside>
        </div>
      </header>

      <Section>
        <div className="card-grid">
          {research.map(r => (
            <article key={r.slug} id={r.slug} className="project-card">
              <div className="project-meta">
                <span className="project-status">●</span>
                <span>{STATUS_LABEL[r.status]}</span>
              </div>
              <h3 className="project-title">{r.title}</h3>
              <p className="project-summary">{r.summary}</p>
              <div className="project-tags">
                {r.tags.map(t => (
                  <Tag key={t} tone={t === 'pre-filing' ? STATUS_TONE.summary : 'neutral'}>
                    {t}
                  </Tag>
                ))}
              </div>
              <div className="project-actions">
                {r.status === 'public' && r.file && (
                  <Button href={r.file} variant="ghost" size="sm" external>
                    {r.fileLabel} →
                  </Button>
                )}
                {(r.status === 'summary' || r.status === 'in-revision') && (
                  <p style={{ margin: 0, fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a8090' }}>
                    {SUMMARY_NOTE[r.status]}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
