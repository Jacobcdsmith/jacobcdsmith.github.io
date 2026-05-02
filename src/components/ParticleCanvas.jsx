import { useEffect, useRef, useState } from 'react'

function debounce(fn, wait) {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait) }
}

const COLORS = ['#c9485b', '#b8a9c9', '#7d9f7a', '#d4a574']

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const [enabled, setEnabled] = useState(false)

  // Lazy mount: skip on small screens, respect reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 640px)').matches
    if (reduced || small) return
    // Defer to idle so it never blocks initial paint
    const start = () => setEnabled(true)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 })
      return () => window.cancelIdleCallback?.(id)
    }
    const t = setTimeout(start, 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let particles = []
    let animId

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(48, Math.floor(window.innerWidth / 28))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        radius: Math.random() * 1.6 + 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.55
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    const onResize = debounce(resize, 250)
    window.addEventListener('resize', onResize)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [enabled])

  if (!enabled) return null
  return <canvas className="particles" ref={canvasRef} aria-hidden="true" />
}
