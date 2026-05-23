import { useEffect, useState, useRef, useCallback } from "react"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  hue: number
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const createParticle = useCallback((x: number, y: number): Particle => ({
    id: Math.random(),
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    life: 0,
    maxLife: Math.random() * 100 + 50,
    hue: Math.random() * 60 + 300 // Pink to cyan range
  }), [])

  useEffect(() => {
    if (!isClient || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      // Add particles near cursor
      if (Math.random() > 0.7) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY))
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Initial particles
    for (let i = 0; i < 50; i++) {
      particlesRef.current.push(createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife)

      // Maintain minimum particles
      while (particlesRef.current.length < 30) {
        particlesRef.current.push(createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ))
      }

      particlesRef.current.forEach(particle => {
        particle.life++
        particle.x += particle.vx
        particle.y += particle.vy

        // Attract to mouse slightly
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          particle.vx += dx * 0.0001
          particle.vy += dy * 0.0001
        }

        // Wrap around
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        const alpha = 1 - particle.life / particle.maxLife
        const size = Math.max(0.1, 3 * alpha) // Ensure size is never negative

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${alpha * 0.5})`
        ctx.fill()

        // Glow effect
        const glowSize = Math.max(0.3, size * 3) // Ensure glow size is never negative
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${alpha * 0.1})`
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 100, 200, 0.05)'
      ctx.lineWidth = 1
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isClient, createParticle])

  if (!isClient) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ opacity: 0.6 }}
    />
  )
}
