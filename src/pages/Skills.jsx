import { Helmet } from 'react-helmet-async'

export default function Skills() {
  return (
    <section id="skills" className="tab-panel active">
      <Helmet>
        <title>Skills | Jacob C. Smith — Data Analyst &amp; AI Systems Builder</title>
        <meta name="description" content="Technical skills: SQL, Python, Pandas, Tableau, Power BI, Machine Learning, TypeScript, Node.js, MCP Protocol, Fourier Analysis, AI Red Teaming, and more." />
        <meta property="og:title" content="Skills — Jacob C. Smith" />
        <meta property="og:url" content="https://jacobcdsmith.github.io/skills" />
        <link rel="canonical" href="https://jacobcdsmith.github.io/skills" />
      </Helmet>

      <div className="panel-header">
        <h2><span className="prompt">$</span> skills --list</h2>
      </div>
      <div className="panel-content">
        <div className="skills-grid">
          <div className="skill-category">
            <h3>Data &amp; Analytics Core</h3>
            <ul>
              <li>SQL (PostgreSQL, MySQL)</li>
              <li>Python (Pandas, NumPy, scikit-learn)</li>
              <li>Business Intelligence (Tableau, Power BI)</li>
              <li>Machine Learning</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Systems &amp; Infrastructure</h3>
            <ul>
              <li>Linux (Debian/Ubuntu)</li>
              <li>Proxmox/Virtualization</li>
              <li>Git/GitHub Actions</li>
              <li>GPU Acceleration (CUDA, PyTorch, JAX)</li>
              <li>TypeScript / Node.js</li>
              <li>MCP Protocol (server + client)</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Theoretical &amp; Mathematical</h3>
            <ul>
              <li>Fourier Analysis</li>
              <li>Complex Systems Modeling</li>
              <li>Quantum Mechanics</li>
              <li>Sacred Geometry</li>
            </ul>
          </div>
          <div className="skill-category">
            <h3>Specialized Domains</h3>
            <ul>
              <li>AI Red Teaming</li>
              <li>Consciousness Engineering</li>
              <li>Automation Architecture</li>
              <li>Hardware Liberation</li>
              <li>Elixir / Phoenix / LiveView</li>
              <li>OTP / BEAM Concurrency</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
