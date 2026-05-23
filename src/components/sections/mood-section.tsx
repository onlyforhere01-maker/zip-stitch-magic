import { useState, useEffect } from "react"

export interface Mood {
  emoji: string
  label: string
  color: string
  bgGradient: string
  message: string
  powerLevel: number
}

const moods: Mood[] = [
  { 
    emoji: "😴", 
    label: "sleepy", 
    color: "from-blue-500/20 to-indigo-500/20",
    bgGradient: "from-blue-900/50 via-indigo-900/30 to-slate-900/50",
    message: "zzz... five more minutes...",
    powerLevel: 20
  },
  { 
    emoji: "🔥", 
    label: "on fire", 
    color: "from-orange-500/20 to-red-500/20",
    bgGradient: "from-orange-900/50 via-red-900/30 to-rose-900/50",
    message: "ULTRA INSTINCT ACTIVATED",
    powerLevel: 100
  },
  { 
    emoji: "✨", 
    label: "vibing", 
    color: "from-pink-500/20 to-purple-500/20",
    bgGradient: "from-pink-900/50 via-purple-900/30 to-fuchsia-900/50",
    message: "everything is aesthetic rn",
    powerLevel: 75
  },
  { 
    emoji: "🌧️", 
    label: "melancholic", 
    color: "from-slate-500/20 to-gray-500/20",
    bgGradient: "from-slate-900/50 via-gray-900/30 to-zinc-900/50",
    message: "listening to sad songs on repeat",
    powerLevel: 35
  },
  { 
    emoji: "🎮", 
    label: "gaming", 
    color: "from-green-500/20 to-emerald-500/20",
    bgGradient: "from-green-900/50 via-emerald-900/30 to-teal-900/50",
    message: "one more game... or ten",
    powerLevel: 85
  },
  { 
    emoji: "💭", 
    label: "overthinking", 
    color: "from-violet-500/20 to-purple-500/20",
    bgGradient: "from-violet-900/50 via-purple-900/30 to-indigo-900/50",
    message: "my brain has infinite tabs open",
    powerLevel: 60
  },
  { 
    emoji: "⚡", 
    label: "HYPED", 
    color: "from-yellow-500/20 to-amber-500/20",
    bgGradient: "from-yellow-900/50 via-amber-900/30 to-orange-900/50",
    message: "PLUS ULTRAAA!!!",
    powerLevel: 150
  },
  { 
    emoji: "🌸", 
    label: "soft", 
    color: "from-rose-500/20 to-pink-500/20",
    bgGradient: "from-rose-900/50 via-pink-900/30 to-fuchsia-900/50",
    message: "feeling like a main character",
    powerLevel: 50
  },
]

interface MoodSectionProps {
  onMoodChange?: (mood: Mood) => void
}

export function MoodSection({ onMoodChange }: MoodSectionProps) {
  const [selectedMood, setSelectedMood] = useState(moods[2])
  const [isAnimating, setIsAnimating] = useState(false)
  const [powerCharging, setPowerCharging] = useState(false)
  const [displayPower, setDisplayPower] = useState(selectedMood.powerLevel)

  const handleMoodChange = (mood: Mood) => {
    if (mood.label === selectedMood.label) return
    
    setIsAnimating(true)
    setPowerCharging(true)
    
    // Animate power level
    const startPower = displayPower
    const endPower = mood.powerLevel
    const duration = 500
    const startTime = Date.now()
    
    const animatePower = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setDisplayPower(Math.round(startPower + (endPower - startPower) * easeOut))
      
      if (progress < 1) {
        requestAnimationFrame(animatePower)
      } else {
        setPowerCharging(false)
      }
    }
    animatePower()
    
    setTimeout(() => {
      setSelectedMood(mood)
      setIsAnimating(false)
      onMoodChange?.(mood)
    }, 150)
  }

  useEffect(() => {
    onMoodChange?.(selectedMood)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 card-3d ${isAnimating ? 'animate-shake' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${selectedMood.color} opacity-60 transition-all duration-700`} />
      
      {/* Power aura effect */}
      {selectedMood.powerLevel >= 100 && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-orange-500/20 to-transparent" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-orange-500/30 animate-pulse-ring"
              style={{
                width: `${150 + i * 50}%`,
                height: `${150 + i * 50}%`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{'// current mood'}</span>
          <span className={`text-xs font-mono ${powerCharging ? 'animate-text-flicker gradient-text' : 'text-muted-foreground'}`}>
            PWR: {displayPower}%
          </span>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <div className={`relative ${isAnimating ? 'animate-bounce-in' : ''}`}>
            <span className={`text-6xl block transition-transform duration-300 ${selectedMood.powerLevel >= 100 ? 'animate-float scale-110' : 'animate-float'}`}>
              {selectedMood.emoji}
            </span>
            {/* Sparkles around emoji */}
            {selectedMood.powerLevel >= 75 && (
              <>
                <span className="absolute -top-2 -right-2 text-sm animate-sparkle">✨</span>
                <span className="absolute -bottom-1 -left-2 text-sm animate-sparkle" style={{ animationDelay: '0.5s' }}>✨</span>
              </>
            )}
          </div>
          <div className="flex-1">
            <h3 className={`text-2xl font-bold transition-all duration-300 ${selectedMood.powerLevel >= 100 ? 'neon-glow-yellow text-yellow-300' : 'text-foreground'}`}>
              {selectedMood.label}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono italic">
              {`"${selectedMood.message}"`}
            </p>
          </div>
        </div>
        
        {/* Power bar */}
        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                displayPower >= 100 
                  ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 animate-pulse' 
                  : displayPower >= 75 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : displayPower >= 50 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-gray-500 to-slate-500'
              }`}
              style={{ width: `${Math.min(displayPower, 100)}%` }}
            />
          </div>
          {displayPower > 100 && (
            <div className="mt-1 text-center">
              <span className="text-xs font-mono text-yellow-400 animate-text-flicker">
                POWER LEVEL OVER 9000!!!
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {moods.map((mood, index) => (
            <button
              key={mood.label}
              onClick={() => handleMoodChange(mood)}
              className={`group/btn relative rounded-full border px-3 py-1.5 text-sm transition-all duration-300 hover:scale-110 active:scale-95 ${
                selectedMood.label === mood.label
                  ? "border-primary bg-primary/20 text-primary neon-box-glow"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:bg-secondary"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="relative z-10 flex items-center gap-1">
                <span className={`transition-transform duration-200 ${selectedMood.label === mood.label ? 'scale-110' : 'group-hover/btn:scale-125'}`}>
                  {mood.emoji}
                </span>
                <span className="hidden sm:inline">{mood.label}</span>
              </span>
              
              {/* Hover effect */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
