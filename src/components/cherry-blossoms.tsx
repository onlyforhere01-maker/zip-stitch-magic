import { useEffect, useState } from "react"

interface Blossom {
  id: number
  x: number
  size: number
  delay: number
  duration: number
  rotation: number
}

const BLOSSOM_CHARS = ['🌸', '✿', '❀', '🎀']

export function CherryBlossoms() {
  const [blossoms, setBlossoms] = useState<Blossom[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const newBlossoms: Blossom[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 16 + 12,
      delay: Math.random() * 10,
      duration: Math.random() * 10 + 8,
      rotation: Math.random() * 360
    }))
    
    setBlossoms(newBlossoms)
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {blossoms.map((blossom) => (
        <div
          key={blossom.id}
          className="absolute animate-cherry-fall"
          style={{
            left: `${blossom.x}%`,
            top: '-5%',
            fontSize: `${blossom.size}px`,
            animationDelay: `${blossom.delay}s`,
            animationDuration: `${blossom.duration}s`,
            transform: `rotate(${blossom.rotation}deg)`,
            opacity: 0.6
          }}
        >
          {BLOSSOM_CHARS[blossom.id % BLOSSOM_CHARS.length]}
        </div>
      ))}
    </div>
  )
}
