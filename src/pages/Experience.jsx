import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import CVDownload from '../components/CVDownload.jsx'
import profile from '../data/profile.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const items = [
  {
    title: 'Independent Practice — Systems Engineer & AI Researcher',
    org: 'Self-employed',
    period: '2024 — present',
    location: 'Buckhannon, WV (remote, worldwide)',
    bullets: [
      'Operational analytics engagements: SQL, Python, BI dashboards, forecasts, decision systems, and Excel formula systems for KPIs and safety scoring.',
      'AI red-teaming and safety reviews for LLM-powered features and agent stacks; reproducible attack harnesses, severity-ranked findings.',
      'Local-first AI system design: model selection, runtime integration (llama.cpp, Ollama, LM Studio), MCP servers and gateways, and team training.',
      'Industrial systems work for Readyfuels: shipped the WVRTP facility inspection system (React/Vite/TypeScript on Vercel, QR + Power Automate, protected routes) and a 1,135-formula safety + KPI Excel workbook.',
      'Agent infrastructure for Nous Research: built the Hermes plugin — three-subagent stack (codegen, red-team, resource-gathering) under a persistent SOUL.md identity layer with OpenRouter multi-provider routing.',
      'Embedded / edge: ESP32-S3 firmware in C/ESP-IDF and a UNIHIKER K10 skill package covering MicroPython plus the full C/C++ SDK against the actual hardware schematic.',
      'Pro bono digital infrastructure: regional hospitality client (ecommerce platform pivot evaluation) and Spark / sparkwv.org (zero-downtime email infrastructure migration to Google Workspace).',
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
      'Designed a SQLite-backed agentic runtime treating the LLM API as a programmable execution environment.',
      'Implemented multi-provider routing across Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio, OpenRouter.',
      'Added persistent sessions, conversation branching, response diffing, agentic loops, evals, and MCP dual-mode operation.',
      'Companion projects: MCPStarfleetCommand (dual-transport MCP server) and a local WebSocket MCP gateway built to sever cloud dependencies by default.',
    ],
  },
  {
    title: 'NewForce Cohort 11 — Graduate',
    org: 'NewForce',
    period: '2025 — 2026',
    location: 'Remote / WV',
    bullets: [
      'Completed the NewForce Cohort 11 software development program.',
      'Reinforced full-stack web fundamentals applied directly to the Readyfuels WVRTP work.',
    ],
  },
  {
    title: 'Community / Networking — Bridging Innovations Morgantown',
    org: 'Bridging Innovations',
    period: '2025 — present',
    location: 'Morgantown, WV',
    bullets: [
      'Active participant in the Morgantown technology community as a networking and collaboration anchor.',
    ],
  },
]

export default function Experience() {
  return (
    <>
      <SEO
        title="Experience"
        description="Independent practice in operational analytics, AI red-teaming, and local-first AI; current engagements with Readyfuels (WVRTP) and Nous Research (Hermes plugin); JCLAW + MCP infrastructure; ESP32-S3 + UNIHIKER embedded work; EMERGENT-MCF-EI consciousness research; NewForce Cohort 11."
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
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              <strong>{profile.name}</strong> runs an independent practice in operational analytics,
              AI red-teaming, and local-first AI systems out of {profile.location}. Current
              engagements: the WVRTP facility inspection system for{' '}
              <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer">Readyfuels</a>{' '}
              and the Hermes plugin for{' '}
              <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer">Nous Research</a>.
              In parallel he leads the EMERGENT-MCF-EI consciousness research thread and architects
              the JCLAW agentic runtime, MCPStarfleetCommand, and a local WebSocket MCP gateway.
              NewForce Cohort 11 graduate; Bridging Innovations Morgantown member.
            </p>
          </aside>
          <div className="hero-actions">
            <CVDownload variant="primary" size="md" />
          </div>
        </div>
      </header>

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
