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
    skills: ['SQL', 'Python', 'pandas', 'numpy', 'Tableau', 'Power BI', 'Streamlit', 'dbt-style modeling', 'experiment design'],
  },
  {
    title: 'AI / ML Systems',
    skills: ['LLM evaluation', 'prompt engineering', 'agentic loops', 'red-teaming', 'MCP', 'llama.cpp', 'Ollama', 'multi-provider routing'],
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
            Independent data analyst, AI systems builder, and consciousness researcher based in
            {' '}{profile.location}. I work at the intersection of operational analytics and
            local-first AI tooling.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              <strong>{profile.name}</strong> is an independent data analyst, AI systems builder, and
              consciousness researcher based in {profile.location}. He works remotely with teams
              worldwide on operational analytics, AI red-teaming, and local-first AI tooling. He
              previously led consciousness research on the EMERGENT-MCF-EI framework and architects
              the open-source local-first LLM runtime <em>JCLAW</em>.
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
              clear, a red-team report that catches an AI feature before it embarrasses someone, or a
              local-first runtime that lets a team use LLMs without surrendering their data.
            </p>
            <p>
              In parallel, I run a long research thread on consciousness modeling — building
              GPU-accelerated lattice simulations and writing toward a paper on emergent
              meta-cognitive filtering. The same systems-thinking that powers the research shows up
              in every client engagement: model the dynamics, instrument the system, and build
              decisions you can defend.
            </p>
            <p>
              I am based in Buckhannon, West Virginia, work remotely with clients worldwide, and
              prefer engagements that produce an artifact someone can hold and own.
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
            Loom walkthrough, and a clear handoff so your team owns the result.
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
