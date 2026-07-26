import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import Tag from '../components/Tag.jsx'
import Button from '../components/Button.jsx'
import RepoStats from '../components/RepoStats.jsx'
import GitHubActivity from '../components/GitHubActivity.jsx'
import AgentGatewaySchematic from '../components/AgentGatewaySchematic.jsx'
import TechGraph from '../components/TechGraph.jsx'
import profile from '../data/profile.js'
import { projects } from '../data/projects.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

export default function Projects() {
  return (
    <>
      <SEO
        title="Projects"
        description="Data analysis and ML engineering projects: GitHub Language Analysis Platform, CONSIM GPU-accelerated signal processing, the WVRTP facility inspection system (Readyfuels), JCLAW agentic runtime, kairos, Wave Analyzer, and a red-teaming suite — plus embedded and operational analytics work."
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
            A mix of data analysis capstones, GPU-accelerated ML, shipped client work, and agent /
            local-first AI infrastructure. Code is on GitHub where permitted; client work is
            documented under NDA.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              Data &amp; ML: the <strong>GitHub Language Analysis Platform</strong> (1,200+ repo
              capstone) and <strong>CONSIM</strong> — a GPU-accelerated signal-processing framework
              with a 20x performance uplift via CUDA/PyTorch/JAX. Industrial: the{' '}
              <strong>WVRTP facility inspection system</strong> for{' '}
              <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer">Readyfuels</a>.
              Agent infrastructure: <strong>JCLAW</strong>, the Hermes plugin for Nous Research, and{' '}
              <strong>kairos</strong>, a local-first knowledge tool. Also: an Android RF/audio
              spectrum analyzer, a red-teaming console, and embedded work on the UNIHIKER K10 and
              ESP32-S3. Most paid client work is operational analytics under NDA; references on
              request.
            </p>
          </aside>
        </div>
      </header>

      <Section
        eyebrow="How it works"
        title="Agent gateway, in motion."
        lead="A schematic of how a request flows through the local-first agent stack: client to WebSocket gateway to SOUL.md identity layer to router to one of three subagents to tool calls to response. Hover to pause, click any node for detail."
      >
        <AgentGatewaySchematic />
      </Section>

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
                    to={a.to}
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
        eyebrow="Interactive"
        title="Skills, projects & writing — connected."
        lead="A force-directed graph linking every project and post through the technologies they actually share. Click a technology to see everywhere it shows up; click a project or post to see what it's built with."
      >
        <TechGraph />
      </Section>

      <GitHubActivity
        username="Jacobcdsmith"
        limit={10}
        eyebrow="GitHub activity"
        title="Recent commits & releases."
        lead="Live feed of the last public events from the Jacobcdsmith GitHub account. Pulled from the public GitHub API on page load and cached for a minute."
      />
    </>
  )
}
