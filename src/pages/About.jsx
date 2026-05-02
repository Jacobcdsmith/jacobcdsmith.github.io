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
    title: 'Web & Industrial Tooling',
    skills: ['React', 'Vite', 'TypeScript', 'Vercel', 'Power Automate', 'Microsoft 365', 'Excel formula systems', 'protected routes', 'QR capture flows'],
  },
  {
    title: 'Data & Analytics',
    skills: ['SQL', 'Python', 'pandas', 'numpy', 'Tableau', 'Power BI', 'Streamlit', 'KPI modeling', 'experiment design'],
  },
  {
    title: 'Agent & AI Systems',
    skills: ['LLM evaluation', 'subagent orchestration', 'persistent identity (SOUL.md)', 'OpenRouter routing', 'MCP (stdio / SSE / WebSocket)', 'red-teaming', 'JCLAW runtime', 'llama.cpp', 'Ollama', 'LM Studio'],
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
            Industrial systems engineer and AI systems builder spanning industrial → web → AI →
            embedded. Based in {profile.location}; works remotely worldwide.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              <strong>{profile.name}</strong> is a systems engineer and AI systems builder based in{' '}
              {profile.location}. Industrial work for <strong>Readyfuels</strong> (WVRTP facility
              inspection system, 1,135-formula safety + KPI Excel workbook); agent / AI work for{' '}
              <strong>Nous Research</strong> (the <strong>Hermes plugin</strong>) and on his own
              stacks (<em>JCLAW</em>, <em>MCPStarfleetCommand</em>, a local WebSocket MCP gateway);
              embedded / edge work on ESP32-S3 and UNIHIKER K10/M10. NewForce Cohort 11 graduate.{' '}
              {profile.availability}
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
              The industrial work is the anchor. At <strong>Readyfuels</strong> I designed and
              shipped the WVRTP facility inspection system — a React/Vite/TypeScript app on Vercel
              with QR-driven capture, Power Automate pipelines, and protected routes — alongside a
              1,135-formula Excel workbook for safety scoring and KPIs that operators actually use.
              That work runs in real facilities for real people, and it sets the bar for everything
              else.
            </p>
            <p>
              The agent and AI work runs in parallel. I built the <strong>Hermes plugin</strong> for{' '}
              <strong>Nous Research</strong> — a three-subagent stack (codegen, red-team,
              resource-gathering) with a persistent <code>SOUL.md</code> identity layer and OpenRouter
              multi-provider routing. On my own infrastructure side I architect{' '}
              <strong>JCLAW</strong> (a SQLite-backed agentic runtime), <strong>MCPStarfleetCommand</strong>{' '}
              (dual-transport MCP server), and a local WebSocket MCP gateway built so cloud
              dependencies are severed by design. Building and red-teaming the same kind of system
              has taught me more about agent failure modes than either would on its own.
            </p>
            <p>
              The embedded thread is the third leg. ESP32-S3 firmware in C/ESP-IDF and a UNIHIKER
              K10 skill package (MicroPython plus full C/C++ SDK coverage grounded in the actual
              hardware schematic) — with the UNIHIKER M10 scoped as the next personalized AI
              companion build. I am a NewForce Cohort 11 graduate, a Bridging Innovations
              Morgantown member, and {profile.availability.toLowerCase()}
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
                <span className="fact-value">Industrial · Agent · Embedded</span>
              </li>
              <li>
                <span className="fact-label">Availability</span>
                <span className="fact-value">Open to FT roles + consulting</span>
              </li>
              <li>
                <span className="fact-label">Network</span>
                <span className="fact-value">Bridging Innovations · NewForce C11</span>
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
