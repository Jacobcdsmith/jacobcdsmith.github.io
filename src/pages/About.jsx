import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Button from '../components/Button.jsx'
import CVDownload from '../components/CVDownload.jsx'
import Tag from '../components/Tag.jsx'
import CTABanner from '../components/CTABanner.jsx'
import profile from '../data/profile.js'
import { personSchema, professionalServiceSchema, breadcrumbSchema } from '../lib/structured-data.js'

const skillClusters = [
  {
    title: 'Data & Analytics',
    skills: ['SQL', 'Python', 'pandas', 'numpy', 'Tableau', 'Power BI', 'Streamlit', 'Excel formula systems', 'experiment design'],
  },
  {
    title: 'AI / ML Systems',
    skills: ['LLM evaluation', 'prompt engineering', 'subagent orchestration', 'persistent identity (SOUL.md)', 'red-teaming', 'MCP (stdio / SSE / WebSocket)', 'OpenRouter', 'llama.cpp', 'Ollama', 'LM Studio'],
  },
  {
    title: 'Web & Industrial Tooling',
    skills: ['React', 'Vite', 'TypeScript', 'Vercel', 'Power Automate', 'Microsoft 365', 'protected routes', 'QR capture flows'],
  },
  {
    title: 'Embedded & Edge',
    skills: ['ESP32-S3', 'ESP-IDF (C)', 'MicroPython', 'UNIHIKER K10 / M10', 'BLE / Wi-Fi / MQTT', 'modular firmware'],
  },
  {
    title: 'Research & Modeling',
    skills: ['consciousness modeling', 'spectral analysis', 'GPU lattice simulation', 'systems theory', 'decision architecture'],
  },
  {
    title: 'Tooling & Ops',
    skills: ['Git', 'GitHub Actions', 'Linux', 'Docker', 'Linear', 'Replit', 'documentation-as-code'],
  },
]

export default function About() {
  return (
    <>
      <SEO
        title="About"
        description={`${profile.name} — ${profile.authorBio} Based in ${profile.location}.`}
        path="/about"
        jsonLd={[
          personSchema(),
          professionalServiceSchema(),
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'About', url: `${profile.siteUrl}/about` },
          ]),
        ]}
      />

      <header className="page-intro">
        <div className="container">
          <p className="page-eyebrow">About</p>
          <h1 className="page-title">{profile.name}.</h1>
          <p className="page-lead">
            Independent systems engineer, AI red-teamer, and consciousness researcher based in
            {' '}{profile.location}. I work at the intersection of operational analytics,
            local-first AI tooling, and industrial systems.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              <strong>{profile.name}</strong> is an independent systems engineer, AI red-teamer, and
              consciousness researcher based in {profile.location}. He works remotely with teams
              worldwide on operational analytics, AI red-teaming, and local-first AI tooling.
              Current engagements include the WVRTP facility inspection system for{' '}
              <strong>Readyfuels</strong> and the Hermes plugin for <strong>Nous Research</strong>.
              He leads the EMERGENT-MCF-EI consciousness research thread and architects the{' '}
              <em>JCLAW</em> agentic runtime, <em>MCPStarfleetCommand</em>, and a local WebSocket
              MCP gateway.
            </p>
          </aside>
          <div className="hero-actions">
            <CVDownload variant="primary" size="md" />
            <Button to="/services" variant="ghost" size="md">See services</Button>
            <Button href={`mailto:${profile.email}`} variant="ghost" size="md">Email Jacob</Button>
          </div>
        </div>
      </header>

      <Section eyebrow="Bio" title="Short version">
        <div className="about-grid">
          <div className="about-prose">
            <p>
              I help teams that have outgrown spreadsheets but haven’t yet earned a data team. The
              work tends to look like one of three things: a dashboard that finally makes a decision
              clear, a red-team report that catches an AI feature before it embarrasses someone, or
              a local-first runtime that lets a team use LLMs without surrendering their data.
            </p>
            <p>
              Right now that thread runs through two named engagements. For{' '}
              <strong>Readyfuels</strong> I shipped the WVRTP facility inspection system — a
              React/Vite/TypeScript app on Vercel with QR-driven capture, Power Automate
              pipelines, and protected routes — alongside a 1,135-formula safety + KPI Excel
              workbook that operators actually use in the field. For <strong>Nous Research</strong>{' '}
              I built the Hermes plugin: a three-subagent stack (codegen, red-team,
              resource-gathering) running under a persistent <code>SOUL.md</code> identity layer
              with OpenRouter multi-provider routing.
            </p>
            <p>
              In parallel, I run a long research thread on consciousness modeling — building
              GPU-accelerated lattice simulations and writing toward a paper on emergent
              meta-cognitive filtering (EMERGENT-MCF-EI) — and architect a small constellation of
              agent / MCP infrastructure: <em>JCLAW</em> (a SQLite-backed agentic runtime),{' '}
              <em>MCPStarfleetCommand</em> (a dual-transport MCP server), and a local WebSocket
              MCP gateway designed so cloud dependencies are severed by default. The same
              systems-thinking that powers the research shows up in every client engagement: model
              the dynamics, instrument the system, and build decisions you can defend.
            </p>
            <p>
              On the embedded side I work in C/ESP-IDF on the ESP32-S3 and have built a UNIHIKER
              K10 skill package covering MicroPython plus the full C/C++ SDK against the actual
              hardware schematic — with the UNIHIKER M10 scoped as the next personalized AI
              companion build. I am based in Buckhannon, West Virginia, work remotely with clients
              worldwide, and prefer engagements that produce an artifact someone can hold and own.
            </p>
          </div>

          <aside className="about-aside">
            <ul className="fact-list">
              <li>
                <span className="fact-label">Based in</span>
                <span className="fact-value">{profile.location}</span>
              </li>
              <li>
                <span className="fact-label">Works with</span>
                <span className="fact-value">Teams worldwide (remote)</span>
              </li>
              <li>
                <span className="fact-label">Focus</span>
                <span className="fact-value">Analytics · AI · systems</span>
              </li>
              <li>
                <span className="fact-label">Available</span>
                <span className="fact-value">For new engagements</span>
              </li>
              <li>
                <span className="fact-label">Network</span>
                <span className="fact-value">NewForce C11 · Bridging Innovations</span>
              </li>
            </ul>
          </aside>
        </div>

        {skillClusters.map(cluster => (
          <div key={cluster.title} className="skill-cluster">
            <h3>{cluster.title}</h3>
            <div className="skill-tags">
              {cluster.skills.map(s => (
                <Tag key={s} tone="neutral">{s}</Tag>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section eyebrow="Working with me" title="How engagements feel" tone="muted">
        <div className="about-prose">
          <p>
            <strong>Honest scope.</strong> If a project is the wrong fit, I will say so on the
            discovery call and point you somewhere better.
          </p>
          <p>
            <strong>Documented work.</strong> Every engagement ends with written documentation, a
            walkthrough, and a clear handoff so your team owns the result.
          </p>
          <p>
            <strong>Plain language.</strong> I don’t hide behind jargon. If I can’t explain
            something to a non-technical stakeholder, I haven’t understood it well enough yet.
          </p>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <CTABanner
            primary={{ label: 'See services', to: '/services', track: 'about_cta_services' }}
            secondary={{ label: 'Read the blog', to: '/blog', track: 'about_cta_blog' }}
          />
        </div>
      </Section>
    </>
  )
}
