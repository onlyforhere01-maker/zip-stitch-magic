import { useEffect, useState } from "react"

interface SurpriseModeProps {
  active: boolean
}

const scaryMessages = [
  "I SEE YOU",
  "BEHIND YOU",
  "DON&apos;T TURN AROUND",
  "YOU SHOULDN&apos;T HAVE CLICKED",
  "I&apos;VE BEEN WAITING",
  "HELLO THERE",
  "FOUND YOU",
  "CAN&apos;T ESCAPE"
]

export function SurpriseMode({ active }: SurpriseModeProps) {
  const [phase, setPhase] = useState(0)
  const [message, setMessage] = useState("")
  
  useEffect(() => {
    if (!active) {
      // Delay reset so the phase-4 fade-out animation can finish
      // before we unmount the overlay (otherwise screen stays blank)
      const resetTimer = setTimeout(() => setPhase(0), 600)
      return () => clearTimeout(resetTimer)
    }
    
    // Pick random scary message
    setMessage(scaryMessages[Math.floor(Math.random() * scaryMessages.length)])
    
    // Phase 1: Initial glitch (0-500ms)
    setPhase(1)
    
    // Phase 2: Screen flash + text reveal (500-1500ms)
    const timer1 = setTimeout(() => setPhase(2), 500)
    
    // Phase 3: Glitch intensifies (1500-2500ms)
    const timer2 = setTimeout(() => setPhase(3), 1500)
    
    // Phase 4: Fade out (2500-3000ms)
    const timer3 = setTimeout(() => setPhase(4), 2500)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [active])

  if (!active && phase === 0) return null
  // While fading out (phase 4, active just turned false), keep rendering

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Screen flash */}
      {phase >= 1 && phase < 4 && (
        <div 
          className={`absolute inset-0 transition-opacity duration-100 ${
            phase === 2 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle at center, rgba(255,0,100,0.3) 0%, transparent 70%)'
          }}
        />
      )}
      
      {/* Scan lines effect */}
      {phase >= 1 && phase < 4 && (
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
            }}
          />
        </div>
      )}
      
      {/* Glitch overlay */}
      {(phase === 1 || phase === 3) && (
        <div className="absolute inset-0 animate-glitch">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(90deg, transparent 0%, rgba(255,0,100,0.1) 50%, transparent 100%)
              `,
              transform: 'translateX(-100%)',
              animation: 'scan-line 0.5s linear infinite'
            }}
          />
        </div>
      )}
      
      {/* Main scary text */}
      {phase >= 2 && phase < 4 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`animate-dramatic-reveal ${phase === 3 ? 'animate-shake' : ''}`}
          >
            <h1 
              className="glitch-text text-6xl md:text-9xl font-bold text-primary animate-text-flicker"
              data-text={message}
              style={{
                textShadow: `
                  0 0 10px var(--neon-pink),
                  0 0 20px var(--neon-pink),
                  0 0 40px var(--neon-pink),
                  0 0 80px var(--neon-pink)
                `
              }}
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
        </div>
      )}
      
      {/* Red vignette */}
      {phase >= 2 && phase < 4 && (
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(255,0,50,0.4) 100%)',
            opacity: phase === 3 ? 1 : 0.5
          }}
        />
      )}
      
      {/* Fade out overlay */}
      {phase === 4 && (
        <div className="absolute inset-0 bg-background animate-in fade-in duration-500" />
      )}
      
      {/* Random glitch squares */}
      {phase >= 1 && phase < 4 && (
        <GlitchSquares />
      )}
    </div>
  )
}

function GlitchSquares() {
  const [squares, setSquares] = useState<Array<{ id: number; x: number; y: number; w: number; h: number }>>([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSquares(
        Array.from({ length: 5 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          w: Math.random() * 200 + 50,
          h: Math.random() * 20 + 5
        }))
      )
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <>
      {squares.map((sq) => (
        <div
          key={sq.id}
          className="absolute bg-primary/30"
          style={{
            left: `${sq.x}%`,
            top: `${sq.y}%`,
            width: `${sq.w}px`,
            height: `${sq.h}px`,
            mixBlendMode: 'screen'
          }}
        />
      ))}
    </>
  )
}
