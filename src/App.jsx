import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
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
  useEffect(() => {
    console.log('%c⚡ JACOB C. SMITH | PORTFOLIO SYSTEM ONLINE', 'color: #c9485b; font-size: 16px; font-weight: bold;')
    console.log('%c🧠 Systems-Oriented Data Analyst • Consciousness Researcher', 'color: #b8a9c9; font-size: 12px;')
    console.log('%c🌿 Try the Konami code...', 'color: #7d9f7a; font-size: 11px;')
  }, [])

  return (
    <>
      <ParticleCanvas />
      <div className="app-container">
        <Header />
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
