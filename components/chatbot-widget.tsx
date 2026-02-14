'use client'

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, X, Send, Minus } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp: Date
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content:
    'Bonjour ! Je suis le Concierge IA HoteliaSEM. Comment puis-je vous aider aujourd\'hui ? Je peux vous renseigner sur nos hotels, destinations, tarifs, ou services.',
  timestamp: new Date(),
}

/**
 * Simple pattern-matching chatbot responses.
 * Returns a bot reply based on keyword matching.
 */
function generateBotResponse(input: string): string {
  const lower = input.toLowerCase().trim()

  // Greetings
  if (/^(bonjour|salut|hello|bonsoir|coucou|hey|hi)/.test(lower)) {
    return 'Bonjour ! Ravi de vous accueillir. Comment puis-je vous aider ? N\'hesitez pas a me poser des questions sur nos hotels, destinations ou services.'
  }

  // Hotels
  if (/hotel|chambre|suite|hebergement|logement/.test(lower)) {
    return 'Nous proposons une selection d\'hotels de luxe 5 etoiles dans 3 villes du Cameroun : Le Meridien a Douala, le Hilton a Yaounde, et l\'Ilomba Beach Resort a Kribi. Chaque etablissement offre des chambres et suites premium. Souhaitez-vous en savoir plus sur un hotel en particulier ?'
  }

  // Destinations / Cities
  if (/ville|destination|douala|yaounde|yaound|kribi|cameroun/.test(lower)) {
    return 'HoteliaSEM couvre actuellement 3 grandes destinations au Cameroun :\n\n- Douala : Capitale economique, ideal pour les voyages d\'affaires\n- Yaounde : Capitale politique, alliant elegance et culture\n- Kribi : Station balneaire, parfait pour les vacances\n\nQuelle destination vous interesse ?'
  }

  // Pricing / Tarifs
  if (/prix|tarif|cout|combien|coute|cher|reduction|promo/.test(lower)) {
    return 'Nos tarifs commencent a partir de 85 000 XAF/nuit au Meridien Douala, 95 000 XAF/nuit a l\'Ilomba Beach Resort Kribi, et 120 000 XAF/nuit au Hilton Yaounde. Des offres speciales sont regulierement disponibles. Souhaitez-vous reserver ?'
  }

  // Reservation
  if (/reserver|reservation|booking|disponib|libre/.test(lower)) {
    return 'Pour effectuer une reservation, vous pouvez :\n\n1. Consulter nos hotels dans la section "Nos Hotels"\n2. Choisir votre destination et vos dates\n3. Confirmer votre reservation en ligne\n\nNotre equipe est disponible 24/7 pour vous accompagner dans vos demarches.'
  }

  // Services
  if (/service|offr|avantage|premium|luxe|concierge/.test(lower)) {
    return 'HoteliaSEM propose des services premium :\n\n- Concierge IA disponible 24/7\n- Visite virtuelle 3D des hotels\n- Reservation instantanee\n- Service client personnalise\n- Navette aeroport\n- Spa et bien-etre\n\nComment puis-je vous aider davantage ?'
  }

  // Contact / Support
  if (/contact|aide|support|telephone|appeler|email|joindre/.test(lower)) {
    return 'Pour nous contacter :\n\n- Email : contact@hoteliasem.cm\n- Telephone : +237 6XX XXX XXX\n- En ligne : via ce chatbot 24/7\n\nNotre equipe se fera un plaisir de vous assister !'
  }

  // Thanks
  if (/merci|remerci|thank|super|genial|parfait|excellent/.test(lower)) {
    return 'Avec plaisir ! N\'hesitez pas si vous avez d\'autres questions. Je suis la pour vous accompagner dans votre experience HoteliaSEM.'
  }

  // Goodbye
  if (/au revoir|bye|adieu|bonne journee|bonne soiree|a bientot/.test(lower)) {
    return 'Au revoir et a bientot ! N\'hesitez pas a revenir si vous avez des questions. L\'equipe HoteliaSEM vous souhaite une excellente journee.'
  }

  // Fallback
  return 'Je vous remercie pour votre question. Je ne suis pas certain de bien comprendre. Pourriez-vous reformuler ? Je peux vous aider avec :\n\n- Informations sur nos hotels\n- Tarifs et disponibilites\n- Destinations au Cameroun\n- Services premium\n- Reservations'
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      const trimmed = input.trim()
      if (!trimmed || isTyping) return

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsTyping(true)

      // Simulate bot "thinking" delay
      const delay = 600 + Math.random() * 800
      setTimeout(() => {
        const response = generateBotResponse(trimmed)
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'bot',
          content: response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, delay)
    },
    [input, isTyping]
  )

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`glass-card flex flex-col overflow-hidden rounded-2xl border border-primary/20 shadow-2xl shadow-primary/10 transition-all duration-300 ${
            isMinimized
              ? 'h-14 w-72'
              : 'h-[min(520px,80vh)] w-[min(400px,calc(100vw-3rem))]'
          }`}
          role="dialog"
          aria-label="Chatbot Concierge IA"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-semibold text-foreground">
                  Concierge IA
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  HoteliaSEM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? 'Agrandir' : 'Minimiser'}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsOpen(false)
                  setIsMinimized(false)
                }}
                aria-label="Fermer le chatbot"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'rounded-br-md bg-primary text-primary-foreground'
                            : 'rounded-bl-md border border-border/30 bg-muted/50 text-foreground'
                        }`}
                      >
                        {msg.content.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < msg.content.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/30 bg-muted/50 px-4 py-3">
                        <span
                          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        />
                        <span
                          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        />
                        <span
                          className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t border-border/30 px-3 py-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 rounded-xl border border-border/40 bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  disabled={isTyping}
                  aria-label="Message au chatbot"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 shrink-0 rounded-xl bg-primary p-0 text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
                  aria-label="Envoyer"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleToggle}
        className={`group flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 ${
          isOpen ? 'rotate-0' : 'animate-pulse-glow'
        }`}
        aria-label={isOpen ? 'Fermer le chatbot' : 'Ouvrir le chatbot'}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Bot className="h-6 w-6 text-primary-foreground transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  )
}
