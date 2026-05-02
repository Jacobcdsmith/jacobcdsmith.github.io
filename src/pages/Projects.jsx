import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import Button from '../components/Button.jsx'
import profile from '../data/profile.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const projects = [
  {
    name: 'WVRTP Facility Inspection System',
    status: 'Shipped · Client (Readyfuels)',
    summary:
      'Full-stack React/Vite/TypeScript web app on Vercel for facility inspections, with QR-driven capture flows wired into Power Automate.',
    detail:
      'Protected routes, role-aware UI, mobile-first capture, and Microsoft 365 backend integration. Companion artifact: a 1,135-formula Excel workbook for safety scoring and KPIs used by operators in the field.',
    tags: ['react', 'vite', 'typescript', 'vercel', 'power-automate', 'industrial'],
    actions: [
      { label: 'Readyfuels', href: 'https://readyfuels.com', external: true },
      { label: 'Email for case study', href: `mailto:${profile.email}` },
    ],
  },
  {
    name: 'Hermes plugin (Nous Research)',
    status: 'Shipped · Agent infrastructure',
    summary:
      'Three-subagent stack — codegen, red-team, resource-gathering — orchestrated under a persistent SOUL.md identity layer.',
    detail:
      'OpenRouter-based multi-provider routing, deterministic subagent contracts, and red-team-as-first-class behavior so the system tests itself. Built for the Hermes line at Nous Research.',
    tags: ['agent-stacks', 'openrouter', 'red-team', 'identity-layer'],
    actions: [
      { label: 'Nous Research', href: 'https://nousresearch.com', external: true },
    ],
  },
  {
    name: 'JCLAW',
    status: 'Active development',
    summary:
      'SQLite-backed agentic runtime that treats the model API as a programmable execution environment.',
    detail:
      'Persistent sessions, multi-provider routing (Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio, OpenRouter), conversation branching, response diffing, agentic loops, evals, and MCP dual-mode operation. Designed for sovereignty: zero telemetry, fully local.',
    tags: ['llm', 'local-first', 'mcp', 'agent-stacks', 'sqlite'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'MCPStarfleetCommand',
    status: 'Active development',
    summary:
      'Dual-transport MCP server for routing tools and resources across stdio, SSE, and a local WebSocket gateway.',
    detail:
      'Designed alongside JCLAW so the same agent runtime can speak to local-only tools, cloud-hosted MCP servers, and a sovereignty-first WebSocket gateway from one configuration surface.',
    tags: ['mcp', 'agent-infrastructure', 'tooling'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'Local WebSocket MCP gateway',
    status: 'Active development',
    summary:
      'A WebSocket MCP gateway built so cloud dependencies are severed by design — agents and tools stay on your network.',
    detail:
      'Pairs with JCLAW and MCPStarfleetCommand to let teams use modern agent capabilities without surrendering data or telemetry.',
    tags: ['mcp', 'local-first', 'websocket', 'sovereignty'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'UNIHIKER K10 skill package',
    status: 'Active development · Embedded',
    summary:
      'A skill package for the UNIHIKER K10 covering MicroPython plus the full C/C++ SDK, grounded in the actual hardware schematic.',
    detail:
      'Built so other developers can pick up the K10 and ship without re-deriving the SDK from scratch. The UNIHIKER M10 is the scoped target for a personalized AI companion build that reuses this work.',
    tags: ['unihiker', 'esp32-s3', 'micropython', 'c++', 'embedded'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'ESP32-S3 firmware work',
    status: 'Active · Embedded',
    summary:
      'Modular firmware in ESP-IDF / C with documented module boundaries — connectivity, peripheral drivers, and provisioning flows separated cleanly.',
    detail:
      'Designed to be the device-side counterpart to the agent + web layers above: BLE / Wi-Fi / MQTT glue, reproducible flashing, and field-deployment notes.',
    tags: ['esp32', 'esp-idf', 'firmware', 'c', 'embedded'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'EMERGENT-MCF-EI',
    status: 'Active research',
    summary:
      'GPU-accelerated lattice simulation modeling consciousness as a dynamic spectral filter operating in frequency space.',
    detail:
      'Includes a Streamlit dashboard for live exploration of meta-cognitive filtering dynamics, a results pipeline, and a forthcoming preprint targeting Neurons and Cognition (arXiv q-bio.NC).',
    tags: ['research', 'gpu', 'consciousness', 'streamlit'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'jacobcdsmith.github.io',
    status: 'Live',
    summary:
      'This site. Static React + Vite SPA with pre-rendered HTML for SEO/AEO, RSS, and an LLM-friendly llms.txt manifest.',
    detail:
      'GitHub Pages deployment, custom blog pipeline, structured data on every page, light/dark theme, accessible navigation, no external CMS.',
    tags: ['react', 'vite', 'seo', 'static'],
    actions: [{ label: 'Source', href: 'https://github.com/Jacobcdsmith/jacobcdsmith.github.io', external: true }],
  },
  {
    name: 'Pro bono digital infrastructure',
    status: 'Pro bono',
    summary:
      'Two anonymized engagements: a regional hospitality client (ecommerce platform pivot evaluation, BigCommerce → Clover) and Spark / sparkwv.org (email infrastructure migration, HostGator → Google Workspace).',
    detail:
      'For the hospitality client: a vendor-pivot evaluation across cost, payment processing, and operational fit. For Spark: a zero-downtime DNS + mailbox cutover and operational handoff.',
    tags: ['pro-bono', 'ecommerce', 'infrastructure', 'google-workspace'],
    actions: [{ label: 'Email for context', href: `mailto:${profile.email}` }],
  },
]

export default function Projects() {
  return (
    <>
      <SEO
        title="Projects"
        description="WVRTP facility inspection system (Readyfuels), Hermes plugin (Nous Research), JCLAW, MCPStarfleetCommand, UNIHIKER and ESP32-S3 work, EMERGENT-MCF-EI consciousness research, and pro bono engagements."
        path="/projects"
        jsonLd={[
          breadcrumbSchema([
            { name: 'Home', url: profile.siteUrl },
            { name: 'Projects', url: `${profile.siteUrl}/projects` },
          ]),
        ]}
      />

      <header className="page-intro">
        <div className="container">
          <p className="page-eyebrow">Projects</p>
          <h1 className="page-title">Things I’m building.</h1>
          <p className="page-lead">
            Industrial tooling, agent infrastructure, embedded/edge work, and open research.
            Ordered roughly by what is most active right now.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              Flagship work right now: the <strong>WVRTP facility inspection system</strong> for{' '}
              <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer">Readyfuels</a>{' '}
              (React/Vite/TS, Vercel, QR + Power Automate), the{' '}
              <strong>Hermes plugin</strong> for{' '}
              <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer">Nous Research</a>{' '}
              (three-subagent stack with persistent SOUL.md identity), <strong>JCLAW</strong> +{' '}
              <strong>MCPStarfleetCommand</strong> + a local WebSocket MCP gateway, ESP32-S3 firmware
              and a <strong>UNIHIKER K10</strong> skill package, plus the ongoing{' '}
              <strong>EMERGENT-MCF-EI</strong> consciousness-modeling research thread.
            </p>
          </aside>
        </div>
      </header>

      <Section>
        <div className="card-grid">
          {projects.map(p => (
            <article key={p.name} className="project-card">
              <div className="project-meta">
                <span className="project-status">●</span>
                <span>{p.status}</span>
              </div>
              <h3 className="project-title">{p.name}</h3>
              <p className="project-summary">{p.summary}</p>
              <p className="project-detail">{p.detail}</p>
              <div className="project-tags">
                {p.tags.map(t => (
                  <Tag key={t} tone="neutral">{t}</Tag>
                ))}
              </div>
              <div className="project-actions">
                {p.actions.map(a => (
                  <Button
                    key={a.label}
                    href={a.href}
                    external={a.external}
                    variant="ghost"
                    size="sm"
                  >
                    {a.label} →
                  </Button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
