import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle.jsx'

const tabs = [
  { path: '/',           label: 'Home',       end: true },
  { path: '/about',      label: 'About'                  },
  { path: '/services',   label: 'Services'               },
  { path: '/projects',   label: 'Projects'               },
  { path: '/experience', label: 'Experience'             },
  { path: '/blog',       label: 'Blog',       blogActive: true },
  { path: '/contact',    label: 'Contact'                },
]

export default function Header() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="site-header">
      <div className="container header-row">
        <NavLink to="/" className="brand" aria-label="Jacob C. Smith — home">
          <span className="brand-mark">jcs</span>
          <span className="brand-name">Jacob C. Smith<span className="brand-dot">.</span></span>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(o => !o)}
        >
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>

        <nav id="primary-nav" className={`nav${open ? ' is-open' : ''}`} aria-label="Primary">
          {tabs.map(tab => {
            const active = tab.blogActive
              ? location.pathname.startsWith('/blog')
              : tab.end
                ? location.pathname === tab.path
                : location.pathname === tab.path
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                end={tab.end}
                className={() => `nav-link${active ? ' is-active' : ''}`}
              >
                {tab.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
