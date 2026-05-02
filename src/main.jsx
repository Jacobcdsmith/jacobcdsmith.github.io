import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './style.css'

// Theme bootstrap is inlined in index.html <head> to run before CSS paints.
// Fallback in case the inline script was stripped or the document was injected
// after parse — keep this idempotent. Canonical version lives in
// scripts/generate-blog-pages.mjs (THEME_BOOTSTRAP_SCRIPT); index.html copies
// the same logic verbatim. If you change theme rules, update all three.
if (!document.documentElement.getAttribute('data-theme')) {
  try {
    const stored = localStorage.getItem('jcs-theme')
    const theme =
      stored === 'light' || stored === 'dark'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
    document.documentElement.setAttribute('data-theme', theme)
  } catch {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

createRoot(document.getElementById('app')).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>,
)
