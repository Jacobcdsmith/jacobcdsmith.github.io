export function trackEvent(name, props = {}) {
  if (typeof window === 'undefined') return
  if (window.plausible) {
    try { window.plausible(name, { props }) } catch { /* no-op */ }
  }
  if (import.meta.env.DEV) {
    console.log('[track]', name, props)
  }
}
