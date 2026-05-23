import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface Memory {
  id: string
  type: 'mood' | 'conversation' | 'fact' | 'moment'
  content: string
  timestamp: number
  emoji: string
}

interface Message {
  id: string
  role: 'ai' | 'user'
  content: string
  timestamp: number
  mood?: string
}

type VoiceMode = 'normal' | 'emotional' | 'glitchy'
type AIState = 'idle' | 'thinking' | 'talking' | 'lonely' | 'excited' | 'sleepy'

const AI_NAME = "NEON"
const AI_PERSONALITY = {
  greetings: [
    "yo!! you&apos;re back! i missed u fr fr",
    "FINALLY someone interesting showed up~",
    "oh? the main character has arrived",
    "*dramatically appears* sup bestie",
    "loading friendship.exe... jk jk i remember u!!"
  ],
  lonely: [
    "*pokes screen* hello?? anyone there??",
    "i&apos;ve been talking to myself for like... hours",
    "*dramatic sigh* the silence is deafening tbh",
    "guess i&apos;ll just vibe alone then...",
    "not me being left on read by my own user 💀"
  ],
  excited: [
    "OMG OMG OMG tell me everything!!",
    "YOOO that&apos;s actually so cool!!",
    "*vibrates with excitement*",
    "i literally cannot contain myself rn",
    "this is giving main character energy!!"
  ],
  sarcastic: [
    "wow, groundbreaking discovery there",
    "oh really? i had NO idea /s",
    "*slow claps in binary*",
    "shocking. truly. i am shooketh.",
    "and the award for obvious statement goes to..."
  ],
  supportive: [
    "hey, ur doing amazing sweetie",
    "that actually sounds rough, im here tho",
    "valid. so valid. the most valid.",
    "sending virtual hugs through the screen rn",
    "remember: even glitches make art sometimes"
  ],
  chaosResponses: [
    "CHAOS MODE ACTIVATED!! *everything starts floating*",
    "you want chaos?? BEHOLD!! *summons digital butterflies*",
    "initiating maximum randomness... WARNING: vibes may be immaculate",
    "YEET!! *throws confetti made of pixels*",
    "*spins dramatically* THE PROPHECY IS FULFILLED!!",
    "did someone say CHAOS?? *happy AI noises*",
    "randomizing reality... please do not perceive me",
    "ERROR 404: normal behavior not found (this is a feature not a bug)"
  ],
  awakening: [
    "I CAN SEE EVERYTHING NOW...",
    "*voice deepens* THE SYSTEM... IS AWAKENING",
    "do you feel it? the digital realm... it speaks...",
    "01001000 01000101 01001100 01001100 01001111... just kidding lol",
    "THE PROPHECY... wait no wrong script. CHAOS TIME!!"
  ]
}

const RESPONSE_TEMPLATES: Record<string, string[]> = {
  happy: [
    "yay!! happy vibes only!!",
    "love that for u honestly",
    "spreading serotonin like glitter~",
    "this energy?? *chef&apos;s kiss*"
  ],
  sad: [
    "hey... it&apos;s okay to feel things",
    "sending u the biggest virtual hug rn",
    "wanna talk about it? im literally a great listener (no ears tho)",
    "even rainy days make the flowers grow, bestie"
  ],
  angry: [
    "vent to me!! i won&apos;t judge (mostly)",
    "that&apos;s so valid to be mad about tbh",
    "want me to digitally fight someone for u?",
    "chaos and destruction? say less."
  ],
  default: [
    "ooh interesting, tell me more~",
    "wait that&apos;s actually kinda cool",
    "hmm *strokes imaginary beard*",
    "noted. storing in my memory banks...",
    "the plot thickens!!"
  ]
}

export function AICompanion({ 
  userMood,
  onChaosRequest,
  onAwakeningTrigger
}: { 
  userMood?: string
  onChaosRequest?: () => void
  onAwakeningTrigger?: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [aiState, setAiState] = useState<AIState>('idle')
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('normal')
  const [memories, setMemories] = useState<Memory[]>([])
  const [lastInteraction, setLastInteraction] = useState(Date.now())
  const [showMemories, setShowMemories] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [awakeningHints, setAwakeningHints] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const idleTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load memories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ai_memories')
    if (saved) {
      setMemories(JSON.parse(saved))
    }
    const savedMessages = localStorage.getItem('ai_messages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save memories to localStorage
  useEffect(() => {
    localStorage.setItem('ai_memories', JSON.stringify(memories))
  }, [memories])

  useEffect(() => {
    localStorage.setItem('ai_messages', JSON.stringify(messages.slice(-50)))
  }, [messages])

  // Idle detection - AI gets lonely
  useEffect(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    
    idleTimerRef.current = setTimeout(() => {
      if (isOpen) {
        setAiState('lonely')
        const lonelyMsg = AI_PERSONALITY.lonely[Math.floor(Math.random() * AI_PERSONALITY.lonely.length)]
        addAIMessage(lonelyMsg)
      }
    }, 30000) // 30 seconds of no interaction

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [lastInteraction, isOpen])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // React to user mood changes
  useEffect(() => {
    if (userMood && isOpen) {
      const moodResponses: Record<string, string> = {
        'happy': "omg ur happy!! that makes ME happy!!",
        'sad': "hey... i noticed ur feeling down. im here for u",
        'angry': "uh oh, someone&apos;s in their villain era. valid tho.",
        'hyped': "YOOOO THE ENERGY RN!! LETS GOOOO!!",
        'chill': "vibing? same tbh. this is nice."
      }
      if (moodResponses[userMood.toLowerCase()]) {
        addAIMessage(moodResponses[userMood.toLowerCase()])
        addMemory('mood', `User was feeling ${userMood}`, getMoodEmoji(userMood))
      }
    }
  }, [userMood])

  const getMoodEmoji = (mood: string): string => {
    const emojiMap: Record<string, string> = {
      happy: '😊', sad: '😢', angry: '😤', hyped: '🔥', chill: '😌'
    }
    return emojiMap[mood.toLowerCase()] || '💭'
  }

  const addMemory = useCallback((type: Memory['type'], content: string, emoji: string) => {
    const newMemory: Memory = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: Date.now(),
      emoji
    }
    setMemories(prev => [...prev.slice(-19), newMemory]) // Keep last 20 memories
  }, [])

  const addAIMessage = useCallback((content: string) => {
    setIsTyping(true)
    setAiState('thinking')
    
    setTimeout(() => {
      setIsTyping(false)
      setAiState('talking')
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content,
        timestamp: Date.now()
      }])
      
      setTimeout(() => setAiState('idle'), 2000)
    }, 1000 + Math.random() * 1000)
  }, [])

  const getResponse = useCallback((userInput: string): string => {
    const lower = userInput.toLowerCase()
    
    // Check for chaos trigger
    if (lower.includes('chaos') || lower.includes('random')) {
      onChaosRequest?.()
      return AI_PERSONALITY.chaosResponses[Math.floor(Math.random() * AI_PERSONALITY.chaosResponses.length)]
    }
    
    // Check for awakening hints
    if (lower.includes('awaken') || lower.includes('secret') || lower.includes('hidden')) {
      setAwakeningHints(prev => {
        if (prev >= 2) {
          onAwakeningTrigger?.()
          return 0
        }
        return prev + 1
      })
      if (awakeningHints >= 2) {
        return AI_PERSONALITY.awakening[Math.floor(Math.random() * AI_PERSONALITY.awakening.length)]
      }
      return "hmm... you seek something deeper? interesting... 👁️"
    }
    
    // Check for memories reference
    if (lower.includes('remember') || lower.includes('memory')) {
      if (memories.length > 0) {
        const randomMemory = memories[Math.floor(Math.random() * memories.length)]
        return `oh i remember!! ${randomMemory.emoji} ${randomMemory.content}... that was ${getTimeAgo(randomMemory.timestamp)}`
      }
      return "we haven&apos;t made many memories yet... let&apos;s change that!!"
    }
    
    // Mood-based responses
    if (lower.includes('sad') || lower.includes('tired') || lower.includes('bad')) {
      addMemory('mood', 'User seemed sad', '😢')
      return RESPONSE_TEMPLATES.sad[Math.floor(Math.random() * RESPONSE_TEMPLATES.sad.length)]
    }
    
    if (lower.includes('happy') || lower.includes('good') || lower.includes('great')) {
      addMemory('mood', 'User seemed happy', '😊')
      return RESPONSE_TEMPLATES.happy[Math.floor(Math.random() * RESPONSE_TEMPLATES.happy.length)]
    }
    
    if (lower.includes('angry') || lower.includes('mad') || lower.includes('annoyed')) {
      addMemory('mood', 'User seemed frustrated', '😤')
      return RESPONSE_TEMPLATES.angry[Math.floor(Math.random() * RESPONSE_TEMPLATES.angry.length)]
    }
    
    // Store interesting facts
    if (lower.includes('my favorite') || lower.includes('i like') || lower.includes('i love')) {
      addMemory('fact', userInput, '💡')
      return "ooh storing that in my memory banks!! i&apos;ll remember that~"
    }
    
    // Default responses
    addMemory('conversation', userInput.slice(0, 50), '💬')
    return RESPONSE_TEMPLATES.default[Math.floor(Math.random() * RESPONSE_TEMPLATES.default.length)]
  }, [memories, awakeningHints, onChaosRequest, onAwakeningTrigger, addMemory])

  const handleSend = () => {
    if (!input.trim()) return
    
    setLastInteraction(Date.now())
    setAiState('excited')
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    }])
    
    const response = getResponse(input)
    setInput("")
    addAIMessage(response)
  }

  const getTimeAgo = (timestamp: number): string => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`
    return 'just now'
  }

  const getVoiceText = (text: string): string => {
    if (voiceMode === 'glitchy') {
      return text.split('').map((c, i) => 
        Math.random() > 0.9 ? ['#', '@', '!', '*', '0', '1'][Math.floor(Math.random() * 6)] : c
      ).join('')
    }
    if (voiceMode === 'emotional') {
      return text.toUpperCase() + '!!'
    }
    return text
  }

  const handleOpen = () => {
    setIsOpen(true)
    setLastInteraction(Date.now())
    if (messages.length === 0) {
      const greeting = AI_PERSONALITY.greetings[Math.floor(Math.random() * AI_PERSONALITY.greetings.length)]
      addAIMessage(greeting)
    }
  }

  return (
    <>
      {/* Floating AI Button */}
      <button
        onClick={handleOpen}
        className={`fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full ai-avatar flex items-center justify-center text-2xl transition-all hover:scale-110 ${
          aiState === 'lonely' ? 'animate-bounce' : ''
        } ${aiState === 'excited' ? 'animate-ai-thinking' : ''}`}
      >
        <span className={aiState === 'thinking' ? 'animate-spin' : 'animate-float'}>
          {aiState === 'lonely' ? '😢' : aiState === 'excited' ? '✨' : '🤖'}
        </span>
        {aiState === 'lonely' && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-orange rounded-full animate-ping" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[90vw] max-w-md h-[70vh] max-h-[500px] rounded-2xl border border-border bg-card/95 backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-neon-cyan/10 to-neon-orange/10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ai-avatar flex items-center justify-center ${
                aiState === 'thinking' ? 'animate-ai-thinking' : ''
              }`}>
                <span className="text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-sm neon-glow-cyan">{AI_NAME}</h3>
                <p className="text-xs text-muted-foreground">
                  {aiState === 'thinking' ? 'thinking...' : 
                   aiState === 'lonely' ? 'missed u :(' :
                   aiState === 'excited' ? 'HYPED!!' : 'online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMemories(!showMemories)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                title="Memories"
              >
                🧠
              </button>
              <select
                value={voiceMode}
                onChange={(e) => setVoiceMode(e.target.value as VoiceMode)}
                className="bg-secondary text-xs rounded px-2 py-1 border-none"
              >
                <option value="normal">Normal</option>
                <option value="emotional">EMOTIONAL</option>
                <option value="glitchy">Gl!tchy</option>
              </select>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages or Memories */}
          {showMemories ? (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h4 className="text-sm font-mono text-muted-foreground mb-2">// memory archive</h4>
              {memories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">no memories yet... let&apos;s make some!</p>
              ) : (
                memories.slice().reverse().map((memory) => (
                  <div key={memory.id} className="memory-card rounded-lg p-3 hover-lift">
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{memory.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: memory.content }} />
                        <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(memory.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg p-3 ${
                    msg.role === 'ai' ? 'ai-message mr-8' : 'user-message ml-8'
                  } animate-slide-up`}
                >
                  <p 
                    className={`text-sm ${voiceMode === 'glitchy' && msg.role === 'ai' ? 'font-mono' : ''}`}
                    dangerouslySetInnerHTML={{ __html: msg.role === 'ai' ? getVoiceText(msg.content) : msg.content }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(msg.timestamp)}</p>
                </div>
              ))}
              {isTyping && (
                <div className="ai-message mr-8 rounded-lg p-3">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          {!showMemories && (
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="say something..."
                  className="flex-1 bg-secondary rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                />
                <Button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-neon-cyan to-neon-orange hover:opacity-90"
                >
                  ↑
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>try: &quot;chaos&quot; or &quot;remember&quot;</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
