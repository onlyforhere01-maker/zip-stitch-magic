import { useEffect, useState, useRef } from "react"

interface Orb {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
  speed: number
  direction: number
}

export function FloatingOrbs() {
  const [orbs, setOrbs] = useState<Orb[]>([])
  const [isClient, setIsClient] = useState(false)
  const mousePos = useRef({ x: 50, y: 50 })

  useEffect(() => {
    setIsClient(true)
    
    const colors = [
      "bg-pink-500/30",
      "bg-cyan-500/30", 
      "bg-purple-500/30",
      "bg-fuchsia-500/30",
      "bg-violet-500/30",
      "bg-blue-500/30"
    ]
    
    const newOrbs = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 300 + 150,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3,
      speed: Math.random() * 0.5 + 0.2,
      direction: Math.random() * Math.PI * 2
    }))
    
    setOrbs(newOrbs)
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate orbs
  useEffect(() => {
    if (!isClient || orbs.length === 0) return
    
    let animationFrame: number
    
    const animate = () => {
      setOrbs(prev => prev.map(orb => {
        // Move towards mouse slightly
        const dx = mousePos.current.x - orb.x
        const dy = mousePos.current.y - orb.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        let newX = orb.x + Math.cos(orb.direction) * orb.speed * 0.1
        let newY = orb.y + Math.sin(orb.direction) * orb.speed * 0.1
        
        // Slight attraction to mouse
        if (dist < 50) {
          newX += dx * 0.001
          newY += dy * 0.001
        }
        
        // Wrap around
        if (newX < -10) newX = 110
        if (newX > 110) newX = -10
        if (newY < -10) newY = 110
        if (newY > 110) newY = -10
        
        return {
          ...orb,
          x: newX,
          y: newY,
          direction: orb.direction + (Math.random() - 0.5) * 0.02
        }
      }))
      
      animationFrame = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => cancelAnimationFrame(animationFrame)
  }, [isClient, orbs.length])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full ${orb.color} blur-3xl transition-all duration-1000 ease-out`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.4
          }}
        />
      ))}
      
      {/* Animated grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,100,200,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,100,200,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      {/* Scan line effect */}
      <div 
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        style={{
          animation: 'scan-line 8s linear infinite'
        }}
      />
      
      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-primary/20 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-primary/20 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-primary/20 rounded-br-lg" />
      
      {/* Floating kanji/symbols */}
      <div className="absolute top-[15%] right-[10%] text-4xl text-primary/10 animate-float-delayed font-mono">
        夢
      </div>
      <div className="absolute bottom-[20%] left-[8%] text-3xl text-accent/10 animate-float font-mono" style={{ animationDelay: '1s' }}>
        ✧
      </div>
      <div className="absolute top-[60%] right-[15%] text-2xl text-primary/10 animate-float font-mono" style={{ animationDelay: '2s' }}>
        幻
      </div>
    </div>
  )
}
