import { useState, useCallback } from "react"

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "wisdom" },
  { text: "It's not the face that makes someone a monster, it's the choices they make with their lives.", author: "Naruto", category: "anime" },
  { text: "The world isn't perfect. But it's there for us, doing the best it can.", author: "Roy Mustang", category: "anime" },
  { text: "If you don't take risks, you can't create a future.", author: "Monkey D. Luffy", category: "anime" },
  { text: "A lesson without pain is meaningless.", author: "Edward Elric", category: "anime" },
  { text: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", author: "Kenshin Himura", category: "anime" },
  { text: "The moment you think of giving up, think of the reason why you held on so long.", author: "Natsu Dragneel", category: "anime" },
  { text: "Fear is not evil. It tells you what your weakness is.", author: "Gildarts", category: "anime" },
  { text: "Even if I die, you keep living okay? Live to see the end of this world.", author: "Eren Yeager", category: "anime" },
  { text: "Hard work is worthless for those that don't believe in themselves.", author: "Naruto", category: "anime" },
  { text: "Believe in yourself. Not in the you who believes in me. Believe in the you who believes in yourself.", author: "Kamina", category: "anime" },
  { text: "People's lives don't end when they die. It ends when they lose faith.", author: "Itachi Uchiha", category: "anime" },
  { text: "A dropout will beat a genius through hard work.", author: "Rock Lee", category: "anime" },
  { text: "The world is cruel, but also very beautiful.", author: "Mikasa Ackerman", category: "anime" },
  { text: "Reject modernity, embrace chaos.", author: "Someone on the internet", category: "chaotic" },
  { text: "Sleep is for the weak... and I am very weak.", author: "Every developer ever", category: "chaotic" },
]

const categoryColors: Record<string, string> = {
  anime: "text-pink-400 border-pink-400/30 bg-pink-500/10",
  motivation: "text-green-400 border-green-400/30 bg-green-500/10",
  wisdom: "text-blue-400 border-blue-400/30 bg-blue-500/10",
  chaotic: "text-purple-400 border-purple-400/30 bg-purple-500/10",
}

export function QuoteGenerator() {
  const [currentQuote, setCurrentQuote] = useState(quotes[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 10)
  const [showCopied, setShowCopied] = useState(false)
  const [quoteHistory, setQuoteHistory] = useState<typeof quotes>([quotes[0]])

  const generateQuote = useCallback(() => {
    if (isGenerating) return
    
    setIsGenerating(true)
    setGlowIntensity(100)
    setIsLiked(false)
    
    let iterations = 0
    const maxIterations = 12
    
    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setCurrentQuote(randomQuote)
      iterations++
      
      if (iterations >= maxIterations) {
        clearInterval(interval)
        setIsGenerating(false)
        setLikeCount(Math.floor(Math.random() * 100) + 10)
        setQuoteHistory(prev => [randomQuote, ...prev.slice(0, 4)])
        setTimeout(() => setGlowIntensity(0), 500)
      }
    }, 60)
  }, [isGenerating])

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`"${currentQuote.text}" - ${currentQuote.author}`)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-accent/50 md:col-span-2 lg:col-span-2 card-3d">
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, rgba(100, 255, 200, ${glowIntensity / 400}) 0%, transparent 70%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Animated corner brackets */}
      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-accent/30 transition-all group-hover:w-10 group-hover:h-10 group-hover:border-accent" />
      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-accent/30 transition-all group-hover:w-10 group-hover:h-10 group-hover:border-accent" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-accent/30 transition-all group-hover:w-10 group-hover:h-10 group-hover:border-accent" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-accent/30 transition-all group-hover:w-10 group-hover:h-10 group-hover:border-accent" />
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{'// quote generator'}</span>
            <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${categoryColors[currentQuote.category]}`}>
              {currentQuote.category}
            </span>
          </div>
          <div className={`h-2 w-2 rounded-full transition-all ${isGenerating ? 'bg-accent animate-pulse scale-150' : 'bg-muted-foreground/30'}`} />
        </div>
        
        <div className="mt-6 min-h-[120px] flex flex-col justify-center">
          <blockquote 
            className={`text-xl md:text-2xl font-medium leading-relaxed text-foreground transition-all duration-200 ${
              isGenerating ? 'blur-sm scale-95' : 'blur-0 scale-100'
            }`}
          >
            <span className="text-primary text-4xl leading-none animate-float inline-block">&ldquo;</span>
            <span className={isGenerating ? '' : 'animate-slide-up inline'}>{currentQuote.text}</span>
            <span className="text-primary text-4xl leading-none animate-float inline-block" style={{ animationDelay: '0.5s' }}>&rdquo;</span>
          </blockquote>
          
          <p className={`mt-4 text-sm text-muted-foreground font-mono transition-all duration-200 ${isGenerating ? 'blur-sm' : 'blur-0'}`}>
            <span className="text-primary">{'>'}</span> {currentQuote.author}
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all hover:scale-105 active:scale-95 ${
              isLiked 
                ? 'border-pink-500 bg-pink-500/20 text-pink-400' 
                : 'border-border bg-secondary/50 text-muted-foreground hover:border-pink-500/50'
            }`}
          >
            <span className={isLiked ? 'animate-bounce-in' : ''}>{isLiked ? '💖' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>
          
          <button
            onClick={copyQuote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-xs font-mono text-muted-foreground transition-all hover:scale-105 active:scale-95 hover:border-accent/50"
          >
            {showCopied ? (
              <>
                <span className="text-green-400">✓</span>
                <span className="text-green-400">copied!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>copy</span>
              </>
            )}
          </button>
        </div>
        
        <button
          onClick={generateQuote}
          disabled={isGenerating}
          className="mt-4 group/btn relative w-full overflow-hidden rounded-lg border border-accent bg-accent/10 py-3 text-sm font-mono transition-all hover:bg-accent/20 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isGenerating ? (
              <>
                <span className="inline-flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span 
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" 
                      style={{ animationDelay: `${i * 150}ms` }} 
                    />
                  ))}
                </span>
                <span className="animate-text-flicker">channeling wisdom...</span>
              </>
            ) : (
              <>
                <span className="group-hover/btn:rotate-12 transition-transform">✨</span>
                <span>generate new quote</span>
                <span className="group-hover/btn:-rotate-12 transition-transform">✨</span>
              </>
            )}
          </span>
          
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/30 to-transparent group-hover/btn:translate-x-full transition-transform duration-700" />
        </button>
        
        {/* History dots */}
        <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>{quotes.length} quotes in database</span>
          <div className="flex items-center gap-1">
            <span>history:</span>
            {quoteHistory.slice(0, 5).map((_, i) => (
              <span 
                key={i} 
                className={`h-1.5 w-1.5 rounded-full transition-all ${i === 0 ? 'bg-accent' : 'bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
