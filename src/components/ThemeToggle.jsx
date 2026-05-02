import { useEffect, useState } from 'react'
import { trackEvent } from '../lib/analytics.js'

const STORAGE_KEY = 'jcs-theme'

function getInitial() {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitial)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch { /* no-op */ }
  }, [theme])

  const toggle = () => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      trackEvent('theme_toggle', { to: next })
      return next
    })
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <span aria-hidden="true" className="theme-toggle-icon">
        {isDark ? '☀' : '☾'}
      </span>
    </button>
  )
}
