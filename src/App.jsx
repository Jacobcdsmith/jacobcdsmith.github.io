import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ParticleCanvas from './components/ParticleCanvas.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Projects from './pages/Projects.jsx'
import Research from './pages/Research.jsx'
import Experience from './pages/Experience.jsx'
import Contact from './pages/Contact.jsx'
import BlogList from './pages/BlogList.jsx'
import BlogPost from './pages/BlogPost.jsx'
import { trackEvent } from './lib/analytics.js'

function ScrollAndTrack() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    trackEvent('pageview', { path: pathname + (search || '') })
  }, [pathname, search])
  return null
}

function NotFound() {
  return (
    <div className="container">
      <div className="notfound">
        <h1>404</h1>
        <p>That page doesn’t exist (yet).</p>
        <a className="btn btn-primary btn-md" href="/">Back home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>
      <ParticleCanvas />
      <Header />
      <main id="main">
        <ScrollAndTrack />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/skills" element={<Navigate to="/about" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/research" element={<Research />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
