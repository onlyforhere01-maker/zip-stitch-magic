import { useState, useEffect } from "react"

const jokes = [
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs.",
    emoji: "🪲",
    rating: 4.2
  },
  {
    setup: "Why did the anime fan bring a ladder to the convention?",
    punchline: "To reach the next level of weeb.",
    emoji: "🪜",
    rating: 3.8
  },
  {
    setup: "What's a computer's favorite snack?",
    punchline: "Microchips.",
    emoji: "💻",
    rating: 4.5
  },
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything.",
    emoji: "⚛️",
    rating: 4.7
  },
  {
    setup: "What do you call a fake noodle?",
    punchline: "An impasta.",
    emoji: "🍝",
    rating: 4.9
  },
  {
    setup: "Why did the coffee file a police report?",
    punchline: "It got mugged.",
    emoji: "☕",
    rating: 4.1
  },
  {
    setup: "What's an introvert's favorite key?",
    punchline: "Escape.",
    emoji: "⌨️",
    rating: 4.8
  },
  {
    setup: "Why did the scarecrow win an award?",
    punchline: "He was outstanding in his field.",
    emoji: "🌾",
    rating: 4.3
  },
  {
    setup: "What's a skeleton's least favorite room?",
    punchline: "The living room.",
    emoji: "💀",
    rating: 4.0
  },
  {
    setup: "Why don't eggs tell jokes?",
    punchline: "They'd crack each other up.",
    emoji: "🥚",
    rating: 3.9
  },
]

export function JokesSection() {
  const [currentJoke, setCurrentJoke] = useState(jokes[0])
  const [showPunchline, setShowPunchline] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [drumroll, setDrumroll] = useState(false)
  const [laughMeter, setLaughMeter] = useState(0)
  const [jokeCount, setJokeCount] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Animate laugh meter based on rating
  useEffect(() => {
    if (showPunchline) {
      const targetLaugh = currentJoke.rating * 20
      let current = 0
      const interval = setInterval(() => {
        current += 2
        if (current >= targetLaugh) {
          setLaughMeter(targetLaugh)
          clearInterval(interval)
          if (targetLaugh >= 90) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 2000)
          }
        } else {
          setLaughMeter(current)
        }
      }, 20)
      return () => clearInterval(interval)
    } else {
      setLaughMeter(0)
    }
  }, [showPunchline, currentJoke.rating])

  const revealPunchline = () => {
    setDrumroll(true)
    setTimeout(() => {
      setDrumroll(false)
      setShowPunchline(true)
    }, 800)
  }

  const getNewJoke = () => {
    setIsAnimating(true)
    setShowPunchline(false)
    setJokeCount(prev => prev + 1)
    
    setTimeout(() => {
      const availableJokes = jokes.filter(j => j.setup !== currentJoke.setup)
      const newJoke = availableJokes[Math.floor(Math.random() * availableJokes.length)]
      setCurrentJoke(newJoke)
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-yellow-500/50 card-3d">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-cherry-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              {['🎉', '✨', '⭐', '🌟'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {'// jokes (quality varies)'}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl transition-transform duration-300 ${showPunchline ? 'scale-125' : ''} ${drumroll ? 'animate-shake' : ''}`}>
              {currentJoke.emoji}
            </span>
          </div>
        </div>
        
        {/* Joke counter badge */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
          <span className="px-2 py-0.5 text-[10px] font-mono bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">
            #{jokeCount + 1}
          </span>
        </div>
        
        <div className={`mt-4 min-h-[100px] transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>
          <p className="text-foreground font-medium leading-relaxed text-lg">
            {currentJoke.setup}
          </p>
          
          {showPunchline ? (
            <div className="mt-4 animate-bounce-in">
              <p className="text-xl font-bold gradient-text">
                {currentJoke.punchline}
              </p>
              
              {/* Laugh meter */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1">
                  <span>laugh-o-meter</span>
                  <span>{laughMeter.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500"
                    style={{ width: `${laughMeter}%` }}
                  />
                </div>
              </div>
              
              {/* Rating */}
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <span>rating:</span>
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`transition-all ${i < Math.round(currentJoke.rating) ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1 font-mono">({currentJoke.rating})</span>
              </div>
            </div>
          ) : (
            <button
              onClick={revealPunchline}
              disabled={drumroll}
              className={`mt-4 text-sm transition-all font-mono group/reveal ${
                drumroll 
                  ? 'text-yellow-400 animate-pulse' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {drumroll ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">🥁</span>
                  <span>drumroll please...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="group-hover/reveal:animate-bounce">{'>'}</span>
                  <span>reveal punchline</span>
                  <span className="opacity-0 group-hover/reveal:opacity-100 transition-opacity">👀</span>
                </span>
              )}
            </button>
          )}
        </div>
        
        <button
          onClick={getNewJoke}
          className="mt-4 w-full rounded-lg border border-border bg-secondary/50 py-2.5 text-sm font-mono transition-all hover:border-yellow-500 hover:bg-yellow-500/10 hover:scale-[1.02] active:scale-[0.98] group/btn"
        >
          <span className="flex items-center justify-center gap-2">
            <span className="group-hover/btn:animate-spin transition-transform">🎲</span>
            <span>another one</span>
          </span>
        </button>
        
        {/* Stats */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>{jokes.length} jokes loaded</span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">⚡</span>
            {jokeCount} delivered
          </span>
        </div>
      </div>
    </div>
  )
}
