import { useEffect, useState, useCallback } from "react"

interface Trail {
  id: number
  x: number
  y: number
  timestamp: number
}

export function CursorTrail() {
  const [trails, setTrails] = useState<Trail[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newTrail: Trail = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    }
    
    setTrails(prev => [...prev.slice(-15), newTrail])
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    window.addEventListener('mousemove', handleMouseMove)
    
    const cleanup = setInterval(() => {
      const now = Date.now()
      setTrails(prev => prev.filter(t => now - t.timestamp < 500))
    }, 50)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(cleanup)
    }
  }, [isClient, handleMouseMove])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {trails.map((trail, index) => {
        const age = (Date.now() - trail.timestamp) / 500
        const opacity = 1 - age
        const scale = 1 - age * 0.5
        const hue = (index * 20) % 360
        
        return (
          <div
            key={trail.id}
            className="absolute rounded-full"
            style={{
              left: trail.x,
              top: trail.y,
              width: 12 * scale,
              height: 12 * scale,
              opacity: opacity * 0.7,
              background: `hsl(${hue}, 100%, 70%)`,
              boxShadow: `0 0 10px hsl(${hue}, 100%, 70%)`,
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.1s'
            }}
          />
        )
      })}
    </div>
  )
}
