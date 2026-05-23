import { useState, useRef, useEffect, useCallback } from "react"

const songs = [
  { title: "Unravel", artist: "TK from Ling Tosite Sigure", vibe: "emotional damage", genre: "anime", bpm: 130 },
  { title: "SPECIALZ", artist: "King Gnu", vibe: "goes crazy", genre: "anime", bpm: 150 },
  { title: "Glimpse of Us", artist: "Joji", vibe: "3am feels", genre: "sad", bpm: 85 },
  { title: "Pink + White", artist: "Frank Ocean", vibe: "nostalgia trip", genre: "chill", bpm: 95 },
  { title: "Bad Guy", artist: "Billie Eilish", vibe: "villain arc", genre: "alt", bpm: 135 },
  { title: "Shinunoga E-Wa", artist: "Fujii Kaze", vibe: "immaculate vibes", genre: "japanese", bpm: 110 },
  { title: "Heat Waves", artist: "Glass Animals", vibe: "summer nights", genre: "indie", bpm: 80 },
  { title: "Bury the Light", artist: "Casey Edwards", vibe: "MOTIVATED", genre: "game", bpm: 160 },
]

const genreColors: Record<string, string> = {
  anime: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  sad: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  chill: "bg-green-500/20 text-green-300 border-green-500/30",
  alt: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  japanese: "bg-red-500/20 text-red-300 border-red-500/30",
  indie: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  game: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
}

const genreGradients: Record<string, string> = {
  anime: "from-pink-500/30 via-fuchsia-500/20 to-purple-500/30",
  sad: "from-blue-500/30 via-indigo-500/20 to-slate-500/30",
  chill: "from-green-500/30 via-emerald-500/20 to-teal-500/30",
  alt: "from-purple-500/30 via-violet-500/20 to-fuchsia-500/30",
  japanese: "from-red-500/30 via-rose-500/20 to-pink-500/30",
  indie: "from-orange-500/30 via-amber-500/20 to-yellow-500/30",
  game: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30",
}

export function MusicSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [progress, setProgress] = useState(0)
  const [eqBars, setEqBars] = useState<number[]>([20, 40, 60, 80, 60, 40, 20])
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isPoweringUp, setIsPoweringUp] = useState(false)
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const currentSong = songs[currentIndex]

  // Create synthesized audio
  const createAudio = useCallback(() => {
    if (audioContextRef.current) return
    
    audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)
    gainNodeRef.current.gain.value = volume * 0.3
  }, [volume])

  const playNote = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return
    
    const osc = audioContextRef.current.createOscillator()
    const noteGain = audioContextRef.current.createGain()
    
    osc.connect(noteGain)
    noteGain.connect(gainNodeRef.current)
    
    osc.type = 'sine'
    osc.frequency.value = frequency
    
    const now = audioContextRef.current.currentTime
    noteGain.gain.setValueAtTime(0.3, now)
    noteGain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    
    osc.start(now)
    osc.stop(now + duration)
  }, [])

  const playBeat = useCallback(() => {
    const notes = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5
    const randomNote = notes[Math.floor(Math.random() * notes.length)]
    playNote(randomNote, 0.3)
  }, [playNote])

  const startPlaying = useCallback(() => {
    createAudio()
    
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume()
    }
    
    // Play beats based on BPM
    const beatInterval = 60000 / currentSong.bpm
    intervalRef.current = setInterval(() => {
      playBeat()
      
      // Update EQ bars
      setEqBars(prev => prev.map(() => Math.random() * 80 + 20))
      
      // Update progress
      setProgress(prev => (prev + 1) % 100)
    }, beatInterval)
    
    setIsPlaying(true)
  }, [createAudio, currentSong.bpm, playBeat])

  const stopPlaying = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsPlaying(false)
    setEqBars([20, 40, 60, 80, 60, 40, 20])
  }, [])

  const togglePlay = () => {
    if (isPlaying) {
      stopPlaying()
    } else {
      setIsPoweringUp(true)
      setTimeout(() => {
        setIsPoweringUp(false)
        startPlaying()
      }, 300)
    }
  }

  const nextSong = () => {
    stopPlaying()
    setCurrentIndex((prev) => (prev + 1) % songs.length)
    setProgress(0)
  }

  const prevSong = () => {
    stopPlaying()
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length)
    setProgress(0)
  }

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume * 0.3
    }
  }, [volume])

  useEffect(() => {
    return () => {
      stopPlaying()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stopPlaying])

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 md:col-span-2 lg:col-span-1 card-3d ${isPoweringUp ? 'animate-power-up' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${genreGradients[currentSong.genre]} opacity-60 transition-all duration-700`} />
      
      {/* Animated background lines */}
      {isPlaying && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-speed-lines"
              style={{
                top: `${20 + i * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{'// now playing'}</span>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-mono ${genreColors[currentSong.genre]} transition-all ${isPlaying ? 'animate-rainbow-border' : ''}`}>
              {currentSong.genre}
            </span>
          </div>
          
          {/* Volume control */}
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="rounded-full border border-border bg-secondary/50 p-1.5 transition-all hover:border-primary hover:bg-secondary hover:scale-110"
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                {volume > 0 ? (
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                ) : (
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                )}
              </svg>
            </button>
            
            {showVolumeSlider && (
              <div className="absolute right-0 top-full mt-2 rounded-lg border border-border bg-card p-2 shadow-lg z-10 animate-bounce-in">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-primary"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Album art with vinyl */}
        <div className="mt-4 relative aspect-square w-full max-w-[200px] mx-auto">
          {/* Vinyl record */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 ${isPlaying ? 'animate-vinyl-spin' : ''}`}>
            <div className="absolute inset-2 rounded-full border border-gray-700">
              <div className="absolute inset-4 rounded-full border border-gray-600" />
              <div className="absolute inset-8 rounded-full border border-gray-600" />
              <div className="absolute inset-[40%] rounded-full bg-gradient-to-br from-primary/50 to-accent/50" />
            </div>
            {/* Grooves */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-gray-700/30"
                style={{
                  inset: `${10 + i * 5}%`
                }}
              />
            ))}
          </div>
          
          {/* Album cover overlay */}
          <div className={`absolute inset-4 rounded-xl overflow-hidden border-2 border-border bg-gradient-to-br ${genreGradients[currentSong.genre]} shadow-2xl transition-transform duration-300 ${isPlaying ? 'scale-95' : 'scale-100'}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-5xl transition-all ${isPlaying ? 'animate-float scale-110' : ''}`}>
                {currentSong.genre === 'anime' ? '🎌' : 
                 currentSong.genre === 'sad' ? '🌧️' :
                 currentSong.genre === 'chill' ? '🌿' :
                 currentSong.genre === 'alt' ? '🖤' :
                 currentSong.genre === 'japanese' ? '⛩️' :
                 currentSong.genre === 'indie' ? '🌅' : '⚔️'}
              </span>
            </div>
          </div>
        </div>
        
        {/* EQ Visualizer */}
        <div className="mt-4 flex items-end justify-center gap-1 h-12">
          {eqBars.map((height, i) => (
            <div
              key={i}
              className="w-2 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-100"
              style={{ 
                height: `${height}%`,
                opacity: isPlaying ? 1 : 0.3
              }}
            />
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <h3 className={`text-xl font-bold text-foreground truncate transition-all ${isPlaying ? 'neon-glow-pink' : ''}`}>
            {currentSong.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          <p className={`mt-1 text-xs font-mono transition-all ${isPlaying ? 'gradient-text' : 'text-primary'}`}>
            {currentSong.vibe}
          </p>
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={prevSong}
            className="rounded-full border border-border bg-secondary/50 p-2.5 transition-all hover:border-primary hover:bg-secondary hover:scale-110 active:scale-95 hover-lift"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={togglePlay}
            className={`rounded-full border-2 p-4 transition-all hover:scale-110 active:scale-95 power-aura ${
              isPlaying 
                ? 'border-accent bg-accent/20 neon-box-glow-cyan' 
                : 'border-primary bg-primary/20 neon-box-glow'
            }`}
          >
            {isPlaying ? (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={nextSong}
            className="rounded-full border border-border bg-secondary/50 p-2.5 transition-all hover:border-primary hover:bg-secondary hover:scale-110 active:scale-95 hover-lift"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div 
            className={`h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ${isPlaying ? '' : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground font-mono">
          <span className={isPlaying ? 'animate-text-flicker' : ''}>{currentIndex + 1}/{songs.length}</span>
          <span className="flex items-center gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
            {isPlaying ? 'LIVE' : 'PAUSED'}
          </span>
          <span>{currentSong.bpm} BPM</span>
        </div>
      </div>
    </div>
  )
}
