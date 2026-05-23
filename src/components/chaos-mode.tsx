import { useState, useEffect } from "react"

interface ChaosModeProps {
  active: boolean
  onComplete: () => void
}

const CHAOS_MESSAGES = [
  "MAXIMUM CHAOS ACHIEVED!!",
  "REALITY IS OVERRATED ANYWAY",
  "THE VIBES ARE IMMACULATE",
  "ERROR: TOO MUCH AWESOME",
  "RANDOMNESS INTENSIFIES",
  "YOUR SCREEN IS NOW BLESSED",
  "EMBRACE THE BEAUTIFUL CHAOS"
]

const CHAOS_EMOJIS = ["🎉", "✨", "🔥", "💫", "🌈", "⚡", "🎊", "💥", "🦋", "🌸", "🎭", "🎪"]

export function ChaosMode({ active, onComplete }: ChaosModeProps) {
  const [elements, setElements] = useState<Array<{
    id: number
    x: number
    y: number
    emoji: string
    scale: number
    rotation: number
    delay: number
  }>>([])
  const [message, setMessage] = useState("")
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!active) {
      setPhase(0)
      setElements([])
      return
    }

    // Generate random elements
    const newElements = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: CHAOS_EMOJIS[Math.floor(Math.random() * CHAOS_EMOJIS.length)],
      scale: 0.5 + Math.random() * 2,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 500
    }))
    setElements(newElements)
    setMessage(CHAOS_MESSAGES[Math.floor(Math.random() * CHAOS_MESSAGES.length)])

    // Phase progression
    setPhase(1)
    const t1 = setTimeout(() => setPhase(2), 500)
    const t2 = setTimeout(() => setPhase(3), 1500)
    const t3 = setTimeout(() => {
      setPhase(0)
      onComplete()
    }, 3500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [active, onComplete])

  if (!active && phase === 0) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {/* Screen flash */}
      {phase >= 1 && (
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            phase === 1 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.4) 0%, rgba(255, 107, 53, 0.2) 50%, transparent 70%)'
          }}
        />
      )}

      {/* Rainbow scan lines */}
      {phase >= 1 && phase <= 3 && (
        <div className="absolute inset-0 animate-color-cycle">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)'
            }}
          />
        </div>
      )}

      {/* Flying emojis */}
      {phase >= 2 && elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-bounce-in"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.scale * 2}rem`,
            transform: `rotate(${el.rotation}deg)`,
            animationDelay: `${el.delay}ms`,
            filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))'
          }}
        >
          {el.emoji}
        </div>
      ))}

      {/* Main message */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center animate-chaos-shake">
            <h1 
              className="text-4xl md:text-6xl font-bold gradient-text animate-color-cycle"
              style={{
                textShadow: `
                  0 0 20px var(--neon-cyan),
                  0 0 40px var(--neon-orange),
                  0 0 60px var(--neon-pink)
                `
              }}
            >
              {message}
            </h1>
          </div>
        </div>
      )}

      {/* Confetti burst */}
      {phase === 3 && (
        <ConfettiBurst />
      )}
    </div>
  )
}

function ConfettiBurst() {
  const [confetti, setConfetti] = useState<Array<{
    id: number
    x: number
    delay: number
    color: string
    size: number
  }>>([])

  useEffect(() => {
    const colors = ['#00e5ff', '#ff6b35', '#ff69b4', '#00ff88', '#ffff00']
    const pieces = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 500,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 10
    }))
    setConfetti(pieces)
  }, [])

  return (
    <>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 animate-cherry-fall"
          style={{
            left: `${piece.x}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </>
  )
}
