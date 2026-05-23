import { useState, useEffect, useCallback } from "react"

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

export function ClickSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const createSparkles = useCallback((e: MouseEvent) => {
    const newSparkles: Sparkle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX + (Math.random() - 0.5) * 60,
      y: e.clientY + (Math.random() - 0.5) * 60,
      size: Math.random() * 12 + 8,
      delay: Math.random() * 0.2
    }))
    
    setSparkles(prev => [...prev, ...newSparkles])
    
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)))
    }, 1000)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    window.addEventListener('click', createSparkles)
    return () => window.removeEventListener('click', createSparkles)
  }, [isClient, createSparkles])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            animationDelay: `${sparkle.delay}s`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <svg
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 2L14 8L20 8L15 12L17 18L12 14L7 18L9 12L4 8L10 8Z"
              fill="url(#sparkle-gradient)"
            />
            <defs>
              <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--neon-pink)" />
                <stop offset="100%" stopColor="var(--neon-cyan)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  )
}
