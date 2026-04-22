import { Helmet } from 'react-helmet-async'

export default function Experience() {
  return (
    <section id="experience" className="tab-panel active">
      <Helmet>
        <title>Experience | Jacob C. Smith — Data Analyst &amp; AI Systems Builder</title>
        <meta name="description" content="Work history: Internal Technical Lead at Readyfuels, Freelance Developer, Account Manager at FleetPride, and more. NewForce Data Analytics graduate." />
        <meta property="og:title" content="Experience — Jacob C. Smith" />
        <meta property="og:url" content="https://jacobcdsmith.github.io/experience" />
        <link rel="canonical" href="https://jacobcdsmith.github.io/experience" />
      </Helmet>

      <div className="panel-header">
        <h2><span className="prompt">$</span> cat experience.log</h2>
      </div>
      <div className="panel-content">
        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-date">May 2024 - Present</div>
            <div className="timeline-content">
              <h3>Internal Technical Lead</h3>
              <p className="timeline-company">Readyfuels</p>
              <ul>
                <li>Leading internal tooling and systems development for operations and field workflows</li>
                <li>Built <strong>WVRTP Facility Inspection System</strong>: React/Vite/TypeScript SPA with Power Automate integration for field inspection workflows</li>
                <li>Architecting data pipelines and automation infrastructure to streamline business processes</li>
                <li>Bridging operational requirements and technical implementation across cross-functional teams</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">May 2024 - Present</div>
            <div className="timeline-content">
              <h3>Freelance Developer &amp; Data Consultant</h3>
              <ul>
                <li>Custom analytics solutions and web applications for diverse clients</li>
                <li>Time tracking systems with Stripe integration, automated invoicing</li>
                <li>End-to-end delivery: requirements gathering → deployment → training</li>
                <li>Stakeholder translation: technical concepts → business value</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">Sept 2022 - June 2024</div>
            <div className="timeline-content">
              <h3>Account Manager</h3>
              <p className="timeline-company">FleetPride, Buckhannon, WV</p>
              <ul>
                <li><strong>18% YoY revenue increase</strong> ($500K+ territory) through predictive analytics</li>
                <li><strong>25% contract renewal improvement</strong> via CRM data mining and SQL analysis</li>
                <li><strong>82% accuracy</strong> seasonal forecasting models for inventory optimization</li>
                <li>Power BI dashboards: CLV, churn risk, conversion rates, pipeline metrics</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">Aug 2021 - Sept 2022</div>
            <div className="timeline-content">
              <h3>Outside Sales Representative</h3>
              <p className="timeline-company">Cole Truck Parts</p>
              <ul>
                <li><strong>18% lead conversion increase</strong> through CRM analytics and behavioral data</li>
                <li>Territory expansion strategy based on geographic/demographic analysis</li>
                <li>B2B acquisition using data-driven targeting</li>
              </ul>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-date">Aug 2018 - May 2020</div>
            <div className="timeline-content">
              <h3>Sales Agent</h3>
              <p className="timeline-company">U.S. Cellular</p>
              <ul>
                <li><strong>86% monthly target achievement</strong> (12 of 14 months)</li>
                <li>KPI tracking: conversion rates, deal size, customer acquisition cost</li>
                <li>Technical problem-solving for optimal service plan recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="education-section">
          <h3 className="subsection-title">Education &amp; Certifications</h3>
          <div className="education-grid">
            <div className="education-item">
              <h4>NewForce Intensive Data Analytics Program</h4>
              <p className="education-location">Nashville, TN | July - Dec 2024</p>
              <p>SQL, Python, Tableau, Power BI, Machine Learning, Statistical Analysis</p>
              <p><strong>Capstone:</strong> GitHub Language Analysis (live deployment, 78% predictive accuracy)</p>
            </div>
            <div className="education-item">
              <h4>Self-Directed Continuous Learning</h4>
              <ul>
                <li>Linux Foundation: System administration, kernel tuning, embedded systems</li>
                <li>Machine Learning: PyTorch, JAX, inference optimization, LLM prototyping</li>
                <li>Consciousness Research: Academic paper preparation, mathematical formalization</li>
                <li>Cloud/DevOps: CI/CD pipelines, containerization, infrastructure automation</li>
              </ul>
            </div>
          </div>
          <div className="certifications">
            <h4>Certifications:</h4>
            <div className="cert-tags">
              {[
                'Data Literacy - DataCamp (Oct 2024, ID: DL0038972051530)',
                'Python Data Associate - DataCamp (Oct 2024, ID: PDA0019023690945)',
                'AI Engineering for Data Science',
                'Data Manipulation in SQL',
                'Exploratory Data Analysis in Python',
                'Advanced Window Functions (SQL)',
              ].map(c => (
                <span key={c} className="cert-tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
