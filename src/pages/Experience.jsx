import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import CVDownload from '../components/CVDownload.jsx'
import profile from '../data/profile.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const items = [
  {
    title: 'Independent Practice — Data Analyst & AI Systems Builder',
    org: 'Self-employed',
    period: '2024 — present',
    location: 'Buckhannon, WV (remote, worldwide)',
    bullets: [
      'Operational analytics engagements: SQL, Python, BI dashboards, forecasts, and decision systems for ops-led teams.',
      'AI red-teaming and safety reviews for LLM-powered features; reproducible attack harnesses, severity-ranked findings.',
      'Local-first AI system design: model selection, runtime integration (llama.cpp, Ollama, vLLM), MCP servers, and team training.',
      'Active research thread on consciousness modeling and spectral filtering; forthcoming preprint.',
    ],
  },
  {
    title: 'EMERGENT-MCF-EI — Lead Researcher',
    org: 'Independent research',
    period: '2024 — present',
    location: 'Remote',
    bullets: [
      'Designed and implemented GPU-accelerated lattice simulations of meta-cognitive filtering dynamics.',
      'Built a Streamlit dashboard for live spectral exploration and reproducible experiments.',
      'Drafting paper for arXiv q-bio.NC (Neurons and Cognition).',
    ],
  },
  {
    title: 'JCLAW — Architect & Maintainer',
    org: 'Open source',
    period: '2024 — present',
    location: 'Remote',
    bullets: [
      'Designed a local-first LLM runtime treating the model API as a programmable execution environment.',
      'Implemented multi-provider routing across Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio.',
      'Added persistent sessions, conversation branching, response diffing, agentic loops, and MCP dual-mode operation.',
    ],
  },
]

export default function Experience() {
  return (
    <>
      <SEO
        title="Experience"
        description="Selected experience: independent practice, EMERGENT-MCF-EI consciousness research, and JCLAW local-first LLM runtime."
        path="/experience"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'Experience', url: `${profile.siteUrl}/experience` },
          ]),
        ]}
      />

      <header className="page-intro">
        <div className="container">
          <p className="page-eyebrow">Experience</p>
          <h1 className="page-title">Selected work.</h1>
          <p className="page-lead">
            A short version. For the long version, download the CV or email for references on
            specific engagements.
          </p>
          <div className="hero-actions">
            <CVDownload variant="primary" size="md" />
          </div>
        </div>
      </header>

      <Section eyebrow="In short" title="The TL;DR" tone="muted">
        <div className="answer-box">
          <p className="answer-box-label">TL;DR</p>
          <p>
            <strong>{profile.name}</strong> runs an independent practice in operational analytics,
            AI red-teaming, and local-first AI systems out of {profile.location}. In parallel he
            leads the EMERGENT-MCF-EI consciousness research thread and architects the JCLAW
            local-first LLM runtime. Engagements span SQL, Python, BI, LLM evaluation, llama.cpp /
            Ollama / vLLM, MCP, and decision-architecture audits.
          </p>
        </div>
      </Section>

      <Section>
        <div className="timeline">
          {items.map(item => (
            <article key={item.title} className="timeline-item">
              <h3>{item.title}</h3>
              <div className="timeline-meta">
                <span>{item.org}</span>
                <span>·</span>
                <span>{item.period}</span>
                <span>·</span>
                <span>{item.location}</span>
              </div>
              <ul>
                {item.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
