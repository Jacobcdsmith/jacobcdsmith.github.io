import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import Button from '../components/Button.jsx'
import profile from '../data/profile.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const projects = [
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
    name: 'JCLAW',
    status: 'Active development',
    summary:
      'Local-first LLM runtime that treats the model API as a programmable execution environment.',
    detail:
      'Persistent sessions, multi-provider routing (Anthropic, OpenAI, Groq, Gemini, Ollama, LM Studio), conversation branching, response diffing, agentic loops, MCP dual-mode operation. Designed for sovereignty: zero telemetry, fully local.',
    tags: ['llm', 'local-first', 'mcp', 'tooling'],
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
    name: 'Operational analytics engagements',
    status: 'Client work',
    summary:
      'A growing portfolio of dashboards, forecasts, and decision-support systems built for ops leaders and small teams.',
    detail:
      'Detailed case studies on request — most client work is under NDA. Email for references.',
    tags: ['analytics', 'sql', 'python', 'bi'],
    actions: [{ label: 'Email for references', href: `mailto:${profile.email}` }],
  },
]

export default function Projects() {
  return (
    <>
      <SEO
        title="Projects"
        description="Selected projects: EMERGENT-MCF-EI consciousness research, JCLAW local-first LLM runtime, and operational analytics engagements."
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
            A mix of open research, infrastructure, and client work. Code is on GitHub where
            permitted; client work is documented under NDA.
          </p>
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
