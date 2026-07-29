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
    title: 'ML & Statistics',
    skills: ['Supervised/unsupervised learning', 'time-series forecasting', 'statistical inference (ANOVA, correlation)', 'feature engineering', 'model validation', 'scikit-learn'],
  },
  {
    title: 'Data & Analytics',
    skills: ['SQL', 'Python', 'pandas', 'numpy', 'Tableau', 'Power BI', 'Streamlit', 'Excel formula systems', 'experiment design'],
  },
  {
    title: 'Deep Learning & GPU',
    skills: ['CUDA', 'PyTorch', 'JAX', 'GPU acceleration', 'real-time signal processing', 'anomaly detection'],
  },
  {
    title: 'AI / Agent Systems',
    skills: ['LLM evaluation', 'prompt engineering', 'subagent orchestration', 'red-teaming', 'MCP (stdio / SSE / WebSocket)', 'OpenRouter', 'Ollama', 'LM Studio'],
  },
  {
    title: 'Full-Stack & Web Development',
    skills: ['JavaScript', 'HTML/CSS', 'React', 'Vite', 'TypeScript', 'Vercel', 'REST APIs', 'Power Automate', 'Microsoft 365', 'protected routes'],
  },
  {
    title: 'Embedded & Edge',
    skills: ['ESP32-S3', 'ESP-IDF (C)', 'MicroPython', 'UNIHIKER K10 / M10', 'BLE / Wi-Fi / MQTT', 'modular firmware'],
  },
  {
    title: 'Tooling & Systems Integration',
    skills: ['Git', 'GitHub Actions', 'Linux', 'Docker', 'CI/CD', 'API / webhook integration', 'Elixir (exploratory)', 'documentation-as-code'],
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
            Data scientist and ML engineer based in {profile.location}, transitioning from seven
            years of enterprise sales into applied analytics and machine learning.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              <strong>{profile.name}</strong> is a data scientist and ML engineer based in{' '}
              {profile.location}. After seven years in enterprise sales and account management
              (FleetPride, Cole Truck Parts), he completed the NewForce Cohort 11 data science
              program and now builds GPU-accelerated ML systems, production analytics, and shipped
              client work — the WVRTP facility inspection system for <strong>Readyfuels</strong>{' '}
              and the Hermes plugin for <strong>Nous Research</strong>. Open to full-time Data
              Scientist / ML Engineer roles.
            </p>
          </aside>
          <div className="hero-actions">
            <CVDownload variant="primary" size="md" />
            <Button to="/projects" variant="ghost" size="md">See projects</Button>
            <Button href={`mailto:${profile.email}`} variant="ghost" size="md">Email Jacob</Button>
          </div>
        </div>
      </header>

      <Section eyebrow="Bio" title="Short version">
        <div className="about-grid">
          <div className="about-prose">
            <p>
              Seven years in enterprise sales and account management taught me how decisions
              actually get made inside a business — what data gets trusted, what gets ignored, and
              why. The <strong>NewForce Cohort 11</strong> data science program gave me the tools to
              build the systems that should have existed the whole time: SQL, Python, statistical
              modeling, and dashboard architecture that stakeholders actually use.
            </p>
            <p>
              On the ML side, <strong>CONSIM</strong> is a GPU-accelerated framework for real-time
              pattern detection in high-dimensional time-series data — a 20x performance uplift over
              a CPU baseline using CUDA/PyTorch and JAX, with phase-coherence tracking and
              spectral-analysis modules for streaming anomaly detection. The{' '}
              <strong>GitHub Language Analysis Platform</strong> is a data-analysis capstone
              spanning 1,200+ repositories, from ANOVA-backed language comparisons to an interactive
              React/Plotly dashboard.
            </p>
            <p>
              On the delivery side: for <strong>Readyfuels</strong> I shipped the WVRTP facility
              inspection system — a React/Vite/TypeScript app on Vercel with QR-driven capture and
              Power Automate pipelines — alongside a 1,135-formula Excel workbook for field safety
              scoring and KPIs. For <strong>Nous Research</strong> I built the Hermes plugin: a
              three-subagent stack (codegen, red-team, resource-gathering) running under a
              persistent <code>SOUL.md</code> identity layer with OpenRouter multi-provider routing.
            </p>
            <p>
              I'm not narrowly a modeling-only data scientist — I ship the full stack around the
              model. That means JavaScript, HTML/CSS, and React on the front end (this site and the
              WVRTP app are both built and deployed by me end to end), SQL and API/webhook
              integration wiring services together, and some exploratory work in Elixir/Phoenix.
              If a role needs someone who can move between a Jupyter notebook, a dashboard, and a
              deployed web app in the same week, that's the shape of practice this reflects.
            </p>
            <p>
              I also maintain <strong>JCLAW</strong> and <strong>kairos</strong>, local-first
              AI/agent infrastructure built so data never has to leave the room, and do embedded
              work in C/ESP-IDF on the ESP32-S3 plus a UNIHIKER K10 skill package. I am based in
              Buckhannon, West Virginia, open to remote or relocation, and prefer roles and
              engagements that produce an artifact someone can hold and own.
            </p>
          </div>

          <aside className="about-aside">
            <ul className="fact-list">
              <li>
                <span className="fact-label">Based in</span>
                <span className="fact-value">{profile.location}</span>
              </li>
              <li>
                <span className="fact-label">Open to</span>
                <span className="fact-value">Full-time roles (remote or relocation)</span>
              </li>
              <li>
                <span className="fact-label">Focus</span>
                <span className="fact-value">Data science · ML · analytics</span>
              </li>
              <li>
                <span className="fact-label">Also available</span>
                <span className="fact-value">For scoped engagements</span>
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
