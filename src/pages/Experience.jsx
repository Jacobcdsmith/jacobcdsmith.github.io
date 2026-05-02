import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import CVDownload from '../components/CVDownload.jsx'
import profile from '../data/profile.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const items = [
  {
    title: 'Systems Engineer — Readyfuels',
    org: (
      <>
        <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer">
          readyfuels.com
        </a>
      </>
    ),
    period: 'Nov 2025 — present',
    location: 'Remote',
    bullets: [
      'Designed and shipped the WVRTP facility inspection system: React/Vite/TypeScript on Vercel, QR-driven capture, Power Automate pipelines, protected routes, role-aware UI.',
      'Built a 1,135-formula Excel workbook for safety scoring and KPIs that operators use in the field.',
      'Coordinated stakeholders across operations and EHS to keep the system shipping against real-world use.',
      'Industrial-context systems thinking: the same modeling discipline applied to the agent / AI work.',
    ],
  },
  {
    title: 'Independent Practice — Systems Engineer & AI Systems Builder',
    org: 'Self-employed',
    period: '2024 — present',
    location: 'Buckhannon, WV (remote, worldwide)',
    bullets: [
      'Agent & AI systems: built the Hermes plugin (three-subagent stack with SOUL.md persistent identity, OpenRouter routing) for Nous Research.',
      'Architecting JCLAW (SQLite-backed agentic runtime), MCPStarfleetCommand (dual-transport MCP server), and a local WebSocket MCP gateway designed to sever cloud dependencies.',
      'Embedded / edge: ESP32-S3 firmware in ESP-IDF / C and a UNIHIKER K10 skill package covering MicroPython + the full C/C++ SDK against the actual hardware schematic.',
      'Pro bono digital infrastructure: regional hospitality client (ecommerce platform pivot evaluation, BigCommerce → Clover) and Spark / sparkwv.org (email infrastructure migration, HostGator → Google Workspace).',
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
        description="Systems Engineer at Readyfuels (WVRTP), Hermes plugin for Nous Research, JCLAW + MCP infrastructure, ESP32-S3 + UNIHIKER embedded work, EMERGENT-MCF-EI research, NewForce Cohort 11."
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
            A short version of the last six months and what came before. For the long version,
            download the CV or email for references.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              <strong>{profile.name}</strong> is currently Systems Engineer at{' '}
              <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer">Readyfuels</a>{' '}
              shipping the WVRTP facility inspection system, alongside agent / AI work (the Hermes
              plugin for Nous Research, JCLAW, MCPStarfleetCommand) and embedded / edge work
              (ESP32-S3, UNIHIKER K10/M10). NewForce Cohort 11 graduate; Bridging Innovations
              Morgantown member. {profile.availability}
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
