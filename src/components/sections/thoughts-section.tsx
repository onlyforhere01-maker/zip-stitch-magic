import { useState, useEffect, useRef } from "react"

const thoughts = [
  "why does 2am feel different than 2pm",
  "i think my cat judges me",
  "what if colors look different to everyone",
  "forgot why i walked into this room again",
  "is water wet or does it make things wet",
  "i should probably sleep more",
  "that embarrassing thing from 2019 is haunting me rn",
  "ctrl+z should work in real life",
  "why do i remember all song lyrics but not what i studied",
  "my brain has too many tabs open",
  "i wonder what my parallel universe self is doing",
  "should i learn to cook or just vibe",
  "plot twist: the main character was me all along",
  "existential crisis speedrun any%",
  "is cereal soup? discuss.",
  "what if we're all NPCs in someone's game",
]

export function ThoughtsSection() {
  const [visibleThoughts, setVisibleThoughts] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const thoughtsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const shuffled = [...thoughts].sort(() => Math.random() - 0.5)
    setVisibleThoughts(shuffled.slice(0, 3))
  }, [])

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const addNewThought = () => {
    if (isTyping) return
    setIsTyping(true)
    
    const available = thoughts.filter(t => !visibleThoughts.includes(t))
    if (available.length === 0) {
      setIsTyping(false)
      return
    }
    
    const newThought = available[Math.floor(Math.random() * available.length)]
    
    // Typewriter effect
    let i = 0
    setTypingText("")
    const typeInterval = setInterval(() => {
      if (i < newThought.length) {
        setTypingText(newThought.slice(0, i + 1))
        i++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setVisibleThoughts(prev => [newThought, ...prev.slice(0, 3)])
          setTypingText("")
          setIsTyping(false)
        }, 300)
      }
    }, 30)
  }

  const dismissThought = (index: number) => {
    setVisibleThoughts(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-accent/50 card-3d">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Decorative terminal header */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-secondary/50 flex items-center px-2 gap-1.5 rounded-t-2xl">
        <div className="h-2 w-2 rounded-full bg-red-500/60" />
        <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
        <div className="h-2 w-2 rounded-full bg-green-500/60" />
        <span className="ml-2 text-[9px] font-mono text-muted-foreground">thoughts.exe</span>
      </div>
      
      <div className="relative pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            {'// random thoughts'}
            <span className={`h-1.5 w-1.5 rounded-full ${isTyping ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
          </span>
          <button
            onClick={addNewThought}
            disabled={isTyping}
            className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-mono transition-all hover:border-accent hover:bg-secondary hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isTyping ? (
              <span className="flex items-center gap-1">
                <span className="animate-spin">⚙</span>
                thinking
              </span>
            ) : (
              '+ think'
            )}
          </button>
        </div>
        
        <div ref={thoughtsRef} className="mt-4 space-y-3 min-h-[120px]">
          {/* Typing indicator with actual text */}
          {isTyping && typingText && (
            <div className="animate-slide-up">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="text-accent">{'>>'}</span>{' '}
                {typingText}
                <span className={`inline-block w-2 h-4 bg-accent ml-0.5 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </p>
            </div>
          )}
          
          {/* Existing thoughts */}
          {visibleThoughts.map((thought, index) => (
            <div
              key={thought}
              className="group/thought relative animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <p className={`text-sm leading-relaxed transition-all duration-300 ${
                index === 0 && !isTyping 
                  ? 'text-foreground' 
                  : 'text-muted-foreground'
              } ${hoverIndex === index ? 'translate-x-2' : ''}`}>
                <span className={`transition-colors ${hoverIndex === index ? 'text-primary' : 'text-accent'}`}>
                  {'>>'}
                </span>{' '}
                {thought}
              </p>
              
              {/* Dismiss button on hover */}
              <button
                onClick={() => dismissThought(index)}
                className={`absolute -right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-destructive transition-all ${
                  hoverIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
              >
                ×
              </button>
            </div>
          ))}
          
          {/* Empty state */}
          {visibleThoughts.length === 0 && !isTyping && (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <span className="text-2xl mb-2">💭</span>
              <p className="text-xs font-mono">brain empty. click + think</p>
            </div>
          )}
        </div>
        
        {/* Stats footer */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>{visibleThoughts.length}/4 thoughts loaded</span>
          <span className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-accent animate-pulse" />
            stream active
          </span>
        </div>
      </div>
    </div>
  )
}
