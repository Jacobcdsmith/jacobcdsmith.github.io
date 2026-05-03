import { Link } from 'react-router-dom'
import NewsletterForm from './NewsletterForm.jsx'
import profile from '../data/profile.js'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand-mark">jcs</span>
              <span className="brand-name">Jacob C. Smith<span className="brand-dot">.</span></span>
            </Link>
            <p className="footer-tagline">
              Independent practice in operational analytics, AI red-teaming, and local-first AI
              systems. Based in {profile.location}.
            </p>
            <NewsletterForm
              variant="footer"
              heading="Newsletter"
              sub="Occasional notes. No spam."
            />
          </div>

          <div className="footer-col">
            <h4>Site</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/research">Research</Link></li>
              <li><Link to="/experience">Experience</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Elsewhere</h4>
            <ul>
              <li><a href={`mailto:${profile.email}`}>Email</a></li>
              <li><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="/rss.xml">RSS feed</a></li>
              <li><a href={profile.resumePath} download>Download CV</a></li>
              <li><a href="/llms.txt">llms.txt</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Jacob C. Smith. All rights reserved.</span>
          <span>Built with React + Vite. Static, ad-free, privacy-respecting.</span>
        </div>
      </div>
    </footer>
  )
}
