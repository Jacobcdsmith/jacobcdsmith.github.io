import { Helmet } from 'react-helmet-async'

export default function Contact() {
  return (
    <section id="contact" className="tab-panel active">
      <Helmet>
        <title>Contact | Jacob C. Smith — Data Analyst &amp; AI Systems Builder</title>
        <meta name="description" content="Get in touch with Jacob C. Smith for data analytics, AI systems, or consciousness research collaboration. Based in Buckhannon, West Virginia." />
        <meta property="og:title" content="Contact Jacob C. Smith" />
        <meta property="og:url" content="https://jacobcdsmith.github.io/contact" />
        <link rel="canonical" href="https://jacobcdsmith.github.io/contact" />
      </Helmet>

      <div className="panel-header">
        <h2><span className="prompt">$</span> contact --init</h2>
      </div>
      <div className="panel-content">
        <div className="contact-content">
          <div className="contact-text">
            <p>Ready to collaborate on data-driven solutions, consciousness research, or systems that operate at the intersection of theory and production?</p>
            <p>Let's build something that maps reality.</p>
          </div>
          <div className="contact-methods">
            <a href="mailto:jacobcsmithd@gmail.com" className="contact-method">
              <span className="contact-icon">✉</span>
              <span>jacobcsmithd@gmail.com</span>
            </a>
            <a href="tel:+13044739980" className="contact-method">
              <span className="contact-icon">☎</span>
              <span>(304) 473-9980</span>
            </a>
            <a href="https://github.com/Jacobcdsmith" target="_blank" rel="noopener noreferrer" className="contact-method">
              <span className="contact-icon">⚡</span>
              <span>github.com/Jacobcdsmith</span>
            </a>
            <a href="https://linkedin.com/in/jacobcsmith" target="_blank" rel="noopener noreferrer" className="contact-method">
              <span className="contact-icon">◉</span>
              <span>linkedin.com/in/jacobcsmith</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
