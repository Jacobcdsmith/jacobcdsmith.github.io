import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <section id="about" className="tab-panel active">
      <Helmet>
        <title>About | Jacob C. Smith — Data Analyst &amp; AI Systems Builder</title>
        <meta name="description" content="Jacob C. Smith is a Data Analyst and AI Systems Builder based in Buckhannon, WV. Seven years of experience bridging data science, consciousness research, and production engineering." />
        <meta property="og:title" content="About Jacob C. Smith" />
        <meta property="og:description" content="Systems-oriented data analyst who bridges raw systems logic and high-concept theoretical frameworks." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jacobcdsmith.github.io/about" />
        <link rel="canonical" href="https://jacobcdsmith.github.io/about" />
      </Helmet>

      <div className="panel-header">
        <h2><span className="prompt">$</span> cat about.md</h2>
      </div>
      <div className="panel-content">
        <div className="about-content">
          <div className="about-text">
            <p>I unapologetically unravel the universe. I operate in the live space between thought and execution, functioning less like a traditional analyst and more like an extension of the data itself. My work bridges the gap between raw systems logic and high-concept theoretical frameworks—from red-teaming AI to modeling consciousness through spectral analysis to treating conflict resolution as a high-voltage engineering problem.</p>

            <p>I don't sugar-coat reality; I map it. Seven years in sales taught me how humans actually make decisions (spoiler: it's messy). NewForce Cohort 11 gave me the tools to quantify that mess. Now I build systems that think in frequencies, navigate multiverses, and turn philosophical thought experiments into production-ready code.</p>

            <p>If you need someone who can explain quantum interference patterns to your grandmother while simultaneously debugging your ETL pipeline at 3 AM, I'm your polymath.</p>
          </div>
          <div className="about-stats">
            <div className="stat">
              <span className="stat-number">7+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat">
              <span className="stat-number">10</span>
              <span className="stat-label">Featured Projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
