import { useEffect, useRef } from 'react'

function debounce(fn, wait) {
  let t
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait) }
}

const COLORS = ['#c9485b', '#b8a9c9', '#7d9f7a', '#d4a574']

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const mouse = { x: null, y: null, radius: 180 }
    let particles = []
    let animId

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.pulsePhase += p.pulseSpeed
        const r = p.radius * (1 + Math.sin(p.pulsePhase) * 0.3)

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2)
        g.addColorStop(0, p.color)
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -0.95
        if (p.y < 0 || p.y > canvas.height)  p.vy *= -0.95

        if (mouse.x !== null) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 0 && dist < mouse.radius) {
            const f = (mouse.radius - dist) / mouse.radius
            p.x -= (dx / dist) * f * 1.5
            p.y -= (dy / dist) * f * 1.5
          }
        }
      }

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(184,169,201,${(1 - d / 140) * 0.5})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    const onResize = debounce(resize, 250)
    const onMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onMouseOut  = () => { mouse.x = null; mouse.y = null }

    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseout', onMouseOut)

    resize()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return <canvas id="particle-canvas" ref={canvasRef} aria-hidden="true" />
}
