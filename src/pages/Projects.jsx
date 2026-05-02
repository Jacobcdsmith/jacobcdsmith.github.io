import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import Button from '../components/Button.jsx'
import RepoStats from '../components/RepoStats.jsx'
import GitHubActivity from '../components/GitHubActivity.jsx'
import profile from '../data/profile.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const projects = [
  {
    name: 'EMERGENT-MCF-EI',
    repo: 'Jacobcdsmith/EMERGENT-MCF-EI',
    status: 'Active research',
    summary:
      'GPU-accelerated lattice simulation modeling consciousness as a dynamic spectral filter operating in frequency space.',
    detail:
      'Includes a Streamlit dashboard for live exploration of meta-cognitive filtering dynamics, a results pipeline, and a forthcoming preprint targeting Neurons and Cognition (arXiv q-bio.NC).',
    tags: ['research', 'gpu', 'consciousness', 'streamlit'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'JCLAW',
    repo: 'Jacobcdsmith/JCLAW',
    status: 'Active development',
    summary:
      'SQLite-backed agentic runtime that treats the LLM API as a programmable execution environment.',
    detail:
      'Persistent sessions, multi-provider routing (Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio, OpenRouter), conversation branching, response diffing, agentic loops, evals, and MCP dual-mode operation. Designed for sovereignty: zero telemetry, fully local.',
    tags: ['llm', 'local-first', 'mcp', 'agent-stacks', 'sqlite'],
    actions: [{ label: 'GitHub', href: profile.github, external: true }],
  },
  {
    name: 'Hermes plugin (Nous Research)',
    status: 'Shipped · Agent infrastructure',
    summary:
      'Three-subagent stack — codegen, red-team, resource-gathering — orchestrated under a persistent SOUL.md identity layer.',
    detail:
      'OpenRouter-based multi-provider routing, deterministic subagent contracts, and red-team-as-first-class behavior so the system tests itself. Built for the Hermes line at Nous Research.',
    tags: ['agent-stacks', 'openrouter', 'red-team', 'identity-layer'],
    actions: [{ label: 'Nous Research', href: 'https://nousresearch.com', external: true }],
  },
  {
    name: 'MCPStarfleetCommand',
    repo: 'Jacobcdsmith/MCPStarfleetCommand',
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
    name: 'WVRTP Facility Inspection System',
    status: 'Shipped · Client (Readyfuels)',
    summary:
      'Full-stack React/Vite/TypeScript web app on Vercel for facility inspections, with QR-driven capture wired into Power Automate.',
    detail:
      'Protected routes, role-aware UI, mobile-first capture, and Microsoft 365 backend integration. Companion artifact: a 1,135-formula Excel workbook for safety scoring and KPIs used by operators in the field.',
    tags: ['react', 'vite', 'typescript', 'vercel', 'power-automate', 'industrial'],
    actions: [
      { label: 'Readyfuels', href: 'https://readyfuels.com', external: true },
      { label: 'Email for case study', href: `mailto:${profile.email}` },
    ],
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
    name: 'jacobcdsmith.github.io',
    repo: 'Jacobcdsmith/jacobcdsmith.github.io',
    status: 'Live',
    summary:
      'This site. Static React + Vite SPA with pre-rendered HTML for SEO/AEO, RSS, and an LLM-friendly llms.txt manifest.',
    detail:
      'GitHub Pages deployment, custom blog pipeline, structured data on every page, light/dark theme, accessible navigation, no external CMS.',
    tags: ['react', 'vite', 'seo', 'static'],
    actions: [{ label: 'Source', href: 'https://github.com/Jacobcdsmith/jacobcdsmith.github.io', external: true }],
  },
  {
    name: 'Operational analytics & pro bono engagements',
    status: 'Client work',
    summary:
      'A growing portfolio of dashboards, forecasts, and decision-support systems built for ops leaders and small teams — plus selected pro bono infrastructure work.',
    detail:
      'Pro bono engagements include a regional hospitality client (ecommerce platform pivot evaluation) and Spark / sparkwv.org (zero-downtime email infrastructure migration from HostGator to Google Workspace). Most paid client work is under NDA — email for references.',
    tags: ['analytics', 'sql', 'python', 'bi', 'pro-bono'],
    actions: [{ label: 'Email for references', href: `mailto:${profile.email}` }],
  },
]

export default function Projects() {
  return (
    <>
      <SEO
        title="Projects"
        description="EMERGENT-MCF-EI consciousness research, JCLAW agentic runtime, Hermes plugin (Nous Research), MCPStarfleetCommand, WVRTP facility inspection system (Readyfuels), UNIHIKER and ESP32-S3 work, plus operational analytics engagements."
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
            A mix of open research, agent / MCP infrastructure, industrial systems work, and
            client engagements. Code is on GitHub where permitted; client work is documented under
            NDA.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              Open research: <strong>EMERGENT-MCF-EI</strong> — a GPU-accelerated lattice
              simulation modeling consciousness as a spectral filter. Agent / MCP infrastructure:{' '}
              <strong>JCLAW</strong>, the <strong>Hermes plugin</strong> for{' '}
              <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer">Nous Research</a>,{' '}
              <strong>MCPStarfleetCommand</strong>, and a local WebSocket MCP gateway. Industrial:
              the <strong>WVRTP facility inspection system</strong> for{' '}
              <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer">Readyfuels</a>.
              Embedded: a UNIHIKER K10 skill package and ESP32-S3 firmware. Most paid client work
              is operational analytics under NDA; references on request.
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
              {p.repo && <RepoStats repo={p.repo} />}
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

      <Section
        eyebrow="GitHub activity"
        title="Recent commits & releases."
        lead="Live feed of the last public events from the Jacobcdsmith GitHub account. Pulled from the public GitHub API on page load and cached for a minute."
      >
        <GitHubActivity username="Jacobcdsmith" limit={10} />
      </Section>
    </>
  )
}
