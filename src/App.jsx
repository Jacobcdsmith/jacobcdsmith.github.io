import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ParticleCanvas from './components/ParticleCanvas.jsx'
import About from './pages/About.jsx'
import Skills from './pages/Skills.jsx'
import Projects from './pages/Projects.jsx'
import Experience from './pages/Experience.jsx'
import Contact from './pages/Contact.jsx'
import BlogList from './pages/BlogList.jsx'
import BlogPost from './pages/BlogPost.jsx'

export default function App() {
  const headerRef = useRef(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('%c⚡ JACOB C. SMITH | PORTFOLIO SYSTEM ONLINE', 'color: #c9485b; font-size: 16px; font-weight: bold;')
      console.log('%c🧠 Systems-Oriented Data Analyst • Consciousness Researcher', 'color: #b8a9c9; font-size: 12px;')
      console.log('%c🌿 Try the Konami code...', 'color: #7d9f7a; font-size: 11px;')
    }
  }, [])

  // Keep --header-height CSS variable in sync with the actual rendered header height
  // so that .tab-content-area margin-top always clears the fixed header.
  // useLayoutEffect runs synchronously after DOM mutations, before the browser paints,
  // eliminating the layout shift that would occur if the runtime height differs from
  // the 245px CSS fallback.
  useLayoutEffect(() => {
    const header = headerRef.current
    if (!header) return
    const update = () => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`)
    }
    update()
    // ResizeObserver is broadly supported but guard against environments that lack it.
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(update)
      ro.observe(header)
      return () => ro.disconnect()
    }
    // Fallback: re-measure on window resize (covers older browsers / embedded webviews).
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <>
      <ParticleCanvas />
      <div className="app-container">
        <Header ref={headerRef} />
        <main className="tab-content-area">
          <Routes>
            <Route path="/" element={<Navigate to="/about" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<Navigate to="/about" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}
