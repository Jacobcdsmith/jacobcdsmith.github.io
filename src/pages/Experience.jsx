import SEO from '../components/SEO.jsx'
import Section from '../components/Section.jsx'
import CVDownload from '../components/CVDownload.jsx'
import profile from '../data/profile.js'
import { breadcrumbSchema } from '../lib/structured-data.js'

const items = [
  {
    title: 'Independent — Data & AI Systems',
    org: 'Self-employed',
    period: 'Nov 2025 — present',
    location: 'Buckhannon, WV (remote, worldwide)',
    bullets: [
      'Shipped the WVRTP facility inspection system for Readyfuels: React/Vite/TypeScript on Vercel, QR-driven capture with browser geolocation, and a Power Automate pipeline into a Microsoft 365 backend — plus a 1,135-formula safety + KPI Excel workbook used by operators in the field.',
      'Built the Hermes plugin for Nous Research: a three-subagent stack (codegen, red-team, resource-gathering) under a persistent SOUL.md identity layer with OpenRouter multi-provider routing.',
      'Local-first AI/agent infrastructure: JCLAW (SQLite-backed agentic runtime) and kairos (provenance-first local knowledge tool).',
      'Operational analytics engagements: SQL, Python, BI dashboards, forecasts, and decision systems for ops leaders and small teams.',
      'Pro bono digital infrastructure: regional hospitality client (ecommerce platform pivot evaluation) and Spark / sparkwv.org (zero-downtime email infrastructure migration to Google Workspace).',
    ],
  },
  {
    title: 'Data Science & ML Projects — CONSIM, GitHub Language Analysis Platform',
    org: 'Independent / NewForce capstone work',
    period: '2024 — present',
    location: 'Remote',
    bullets: [
      'CONSIM: engineered a GPU-accelerated framework for real-time pattern detection in high-dimensional time-series data — a 20x performance uplift via CUDA/PyTorch and JAX, with phase-coherence tracking and spectral-analysis modules for streaming anomaly detection.',
      'GitHub Language Analysis Platform: a six-notebook data-analysis pipeline (ANOVA-backed language comparison, correlation analysis, 3D visualization) across 1,200+ repositories, feeding an interactive React/Plotly dashboard.',
      'Enterprise Predictive Analytics Platform: classification engine with 78% cross-validated accuracy over 200k+ records, served via a REST API and a TypeScript executive dashboard.',
      'Traffic Safety & Infrastructure Optimization: spatio-temporal analysis of 200k+ collision records that informed a $1.2M infrastructure investment strategy.',
    ],
  },
  {
    title: 'Strategic Account Manager | Analytics Lead',
    org: 'FleetPride',
    period: '2022 — 2024',
    location: 'Buckhannon, WV',
    bullets: [
      'Scaled territory revenue by 18% YoY ($500k+) by deploying predictive bundling models and customer segmentation.',
      'Automated CRM reporting via SQL, identifying churn risk and driving a 25% increase in contract renewals.',
      'Developed demand-forecasting models in Power BI with 82% accuracy to optimize inventory across distributed nodes.',
    ],
  },
  {
    title: 'Outside Sales Representative',
    org: 'Cole Truck Parts',
    period: '2021 — 2022',
    location: 'Jane Lew, WV',
    bullets: [
      'Optimized B2B acquisition strategy through CRM lead scoring, improving regional conversion rates by 18%.',
    ],
  },
  {
    title: 'NewForce Cohort 11 — Data Science Program Graduate',
    org: 'NewForce',
    period: '2024 — 2025',
    location: 'Remote / WV',
    bullets: [
      'Intensive data science program: SQL window functions, Python statistical computing, dashboard architecture.',
      '1st place, DataCamp Dog Breed Classification competition; DataCamp certifications in Data Manipulation in SQL, Advanced Window Functions, and Exploratory Data Analysis.',
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
        description="Career transition from enterprise sales (FleetPride, Cole Truck Parts) into data science via NewForce Cohort 11; GPU-accelerated ML (CONSIM); shipped client work with Readyfuels (WVRTP) and Nous Research (Hermes plugin)."
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
            A short version. For the long version, download the résumé or email for references on
            specific engagements.
          </p>
          <aside className="answer-box">
            <p className="answer-box-label">TL;DR</p>
            <p>
              <strong>{profile.name}</strong> spent seven years in enterprise sales and account
              management (FleetPride, Cole Truck Parts) before completing the NewForce Cohort 11
              data science program. He now builds GPU-accelerated ML systems (CONSIM), production
              analytics, and has shipped the WVRTP facility inspection system for{' '}
              <a href="https://readyfuels.com" target="_blank" rel="noopener noreferrer">Readyfuels</a>{' '}
              and the Hermes plugin for{' '}
              <a href="https://nousresearch.com" target="_blank" rel="noopener noreferrer">Nous Research</a>.
              Open to full-time Data Scientist / ML Engineer roles.
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
