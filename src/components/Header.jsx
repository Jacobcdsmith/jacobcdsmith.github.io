import { NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const tabs = [
  { path: '/about',      icon: '⌘', label: 'about'      },
  { path: '/skills',     icon: '◈', label: 'skills'     },
  { path: '/projects',   icon: '⬡', label: 'projects'   },
  { path: '/experience', icon: '◉', label: 'experience' },
  { path: '/contact',    icon: '⚡', label: 'contact'    },
  { path: '/blog',       icon: '✍', label: 'blog'       },
]

export default function Header() {
  const location = useLocation()

  // Keyboard navigation between tabs (arrow keys)
  useEffect(() => {
    function handleKeyDown(e) {
      const btns = Array.from(document.querySelectorAll('.tab-btn'))
      const active = document.activeElement
      const idx = btns.indexOf(active)
      if (idx === -1) return

      let next = idx
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  next = (idx + 1) % btns.length
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + btns.length) % btns.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End')  next = btns.length - 1
      else return

      e.preventDefault()
      btns[next].focus()
      btns[next].click()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="brand-name" data-text="JACOB C. SMITH">JACOB C. SMITH</h1>
        <span className="brand-tagline">Data Analyst • AI Systems Builder • Consciousness Researcher</span>
        <span className="brand-location">Buckhannon, West Virginia</span>
      </div>
      <nav className="tab-nav" role="tablist" aria-label="Portfolio sections">
        {tabs.map(({ path, icon, label }) => {
          // The blog tab should match /blog and /blog/* as active
          const isBlogActive = label === 'blog' && location.pathname.startsWith('/blog')
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                'tab-btn' + (isActive || isBlogActive ? ' active' : '')
              }
              end={label !== 'blog'}
              role="tab"
              aria-selected={
                label === 'blog'
                  ? location.pathname.startsWith('/blog')
                  : location.pathname === path
              }
            >
              <span className="tab-icon">{icon}</span>
              <span className="tab-label">{label}</span>
            </NavLink>
          )
        })}
      </nav>
    </header>
  )
}
