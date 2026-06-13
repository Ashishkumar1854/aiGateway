'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const DEFAULT_SUGGESTIONS = [
  "What is AiGateway?",
  "What services do you offer?",
  "Tell me about personal branding services",
  "What is the pricing model?",
  "How does the 2-day setup work?",
]

// Parse **bold** and line breaks from markdown-like text
function ParsedText({ text }) {
  if (!text) return null
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>
        }
        return part.split('\n').map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))
      })}
    </>
  )
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi there! I'm the **AiGateway Assistant**. I can help you learn about our AI services, pricing, setup process, and custom project options.\n\nWhat would you like to know?",
      suggestions: DEFAULT_SUGGESTIONS,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentSuggestions, setCurrentSuggestions] = useState(DEFAULT_SUGGESTIONS)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Load chat history from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('aigw_chatbot_v2')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.messages && parsed.messages.length > 0) {
          setMessages(parsed.messages)
          // Restore last suggestions
          const lastBotMsg = [...parsed.messages].reverse().find(m => m.sender === 'bot')
          if (lastBotMsg?.suggestions) setCurrentSuggestions(lastBotMsg.suggestions)
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e)
    }
  }, [])

  const saveSession = useCallback((msgs) => {
    try {
      sessionStorage.setItem('aigw_chatbot_v2', JSON.stringify({ messages: msgs }))
    } catch (e) {
      console.error('Failed to save chat history:', e)
    }
  }, [])

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendQuestion = useCallback(async (questionText) => {
    if (!questionText.trim() || loading) return

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: questionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedWithUser = [...messages, userMsg]
    setMessages(updatedWithUser)
    setInputText('')
    setLoading(true)
    setCurrentSuggestions([])

    try {
      const res = await fetch(`${BASE_URL}/api/v1/bot/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText.trim() }),
      })

      if (!res.ok) throw new Error('API failed')
      const data = await res.json()

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.data.answer,
        suggestions: data.data.suggestions || DEFAULT_SUGGESTIONS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      const updatedWithBot = [...updatedWithUser, botMsg]
      setMessages(updatedWithBot)
      setCurrentSuggestions(data.data.suggestions || DEFAULT_SUGGESTIONS)
      saveSession(updatedWithBot)
    } catch (err) {
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        sender: 'bot',
        text: "Sorry, I couldn't connect to the assistant backend. Please check your network or try again in a moment.",
        suggestions: DEFAULT_SUGGESTIONS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      const updatedWithError = [...updatedWithUser, errorMsg]
      setMessages(updatedWithError)
      setCurrentSuggestions(DEFAULT_SUGGESTIONS)
      saveSession(updatedWithError)
    } finally {
      setLoading(false)
    }
  }, [messages, loading, saveSession])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendQuestion(inputText)
    }
  }

  const clearChat = () => {
    const initial = [
      {
        id: 'welcome',
        sender: 'bot',
        text: "👋 Hi there! I'm the **AiGateway Assistant**. I can help you learn about our AI services, pricing, setup process, and custom project options.\n\nWhat would you like to know?",
        suggestions: DEFAULT_SUGGESTIONS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]
    setMessages(initial)
    setCurrentSuggestions(DEFAULT_SUGGESTIONS)
    saveSession(initial)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Launcher Bubble */}
      {!isOpen && (
        <button
          id="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open assistant chat"
          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-2xl shadow-indigo-600/40 transition-all duration-300 hover:scale-110 active:scale-95 group"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          }}
        >
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-12 select-none">💬</span>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-40"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          />
          {/* Unread badge */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-black text-white border-2 border-slate-950">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: '380px',
            maxHeight: '580px',
            background: '#0b0f1a',
            border: '1px solid rgba(99,102,241,0.15)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
            style={{
              background: 'linear-gradient(90deg, rgba(79,70,229,0.15) 0%, rgba(15,18,30,1) 100%)',
              borderBottom: '1px solid rgba(99,102,241,0.12)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-lg"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0b0f1a]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">AiGateway Assistant</p>
                <p className="text-[9px] font-semibold uppercase tracking-widest text-emerald-400 leading-tight">
                  Online · Instant Reply
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="chatbot-clear-btn"
                onClick={clearChat}
                className="px-2 py-1 text-[10px] font-semibold rounded-lg transition-all"
                style={{ color: 'rgba(148,163,184,0.8)', background: 'rgba(30,41,59,0.5)' }}
                title="Clear conversation"
              >
                Clear
              </button>
              <button
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-all"
                style={{ background: 'rgba(30,41,59,0.5)' }}
                aria-label="Close chat"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M9.9 2.1L7.5 4.5l2.4 2.4-.9.9-2.4-2.4L4.2 7.8l-.9-.9L5.7 4.5 3.3 2.1l.9-.9 2.4 2.4L9 1.2z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="flex-1 overflow-y-auto py-4 px-4 space-y-4"
            style={{
              background: '#0b0f1a',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(99,102,241,0.2) transparent',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {/* Bot avatar */}
                {msg.sender === 'bot' && (
                  <div className="h-6 w-6 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-xs"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                    🤖
                  </div>
                )}

                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-[82%]`}>
                  <div
                    className="px-3.5 py-2.5 text-xs leading-relaxed"
                    style={{
                      borderRadius: msg.sender === 'user'
                        ? '18px 18px 4px 18px'
                        : '18px 18px 18px 4px',
                      background: msg.sender === 'user'
                        ? 'linear-gradient(135deg, #4f46e5, #6d28d9)'
                        : 'rgba(30,41,59,0.9)',
                      border: msg.sender === 'user'
                        ? 'none'
                        : '1px solid rgba(99,102,241,0.15)',
                      color: msg.sender === 'user'
                        ? '#f0f0ff'
                        : '#cbd5e1',
                      boxShadow: msg.sender === 'user'
                        ? '0 4px 15px rgba(79,70,229,0.25)'
                        : '0 2px 8px rgba(0,0,0,0.3)',
                    }}
                  >
                    <ParsedText text={msg.text} />
                  </div>
                  <span
                    className="mt-1 px-1 text-[9px]"
                    style={{ color: 'rgba(100,116,139,0.7)' }}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* User avatar */}
                {msg.sender === 'user' && (
                  <div className="h-6 w-6 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-[10px] font-bold"
                    style={{ background: 'rgba(79,70,229,0.3)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                    U
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start gap-2">
                <div className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                  🤖
                </div>
                <div
                  className="px-4 py-3 flex items-center gap-1"
                  style={{
                    background: 'rgba(30,41,59,0.9)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '18px 18px 18px 4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: '#818cf8',
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Suggestion Chips */}
          {currentSuggestions.length > 0 && !loading && (
            <div
              className="px-4 py-3 flex-shrink-0 overflow-x-auto"
              style={{
                background: 'rgba(15,18,30,0.95)',
                borderTop: '1px solid rgba(99,102,241,0.1)',
              }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(99,102,241,0.6)' }}>
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentSuggestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendQuestion(q)}
                    disabled={loading}
                    className="text-[10px] font-medium px-2.5 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-40"
                    style={{
                      background: 'rgba(79,70,229,0.1)',
                      border: '1px solid rgba(99,102,241,0.25)',
                      color: '#a5b4fc',
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = 'rgba(79,70,229,0.25)'
                      e.target.style.borderColor = 'rgba(99,102,241,0.5)'
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'rgba(79,70,229,0.1)'
                      e.target.style.borderColor = 'rgba(99,102,241,0.25)'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div
            className="px-4 py-3 flex items-end gap-2 flex-shrink-0"
            style={{
              background: 'rgba(15,18,30,0.98)',
              borderTop: '1px solid rgba(99,102,241,0.1)',
            }}
          >
            <div
              className="flex-1 flex items-end rounded-xl"
              style={{
                background: 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <textarea
                ref={inputRef}
                id="chatbot-input"
                rows={1}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a question..."
                disabled={loading}
                className="flex-1 bg-transparent text-xs text-slate-200 px-3 py-2.5 placeholder-slate-600 focus:outline-none resize-none"
                style={{ maxHeight: '80px', scrollbarWidth: 'thin' }}
              />
            </div>
            <button
              id="chatbot-send-btn"
              onClick={() => sendQuestion(inputText)}
              disabled={loading || !inputText.trim()}
              className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-90"
              style={{
                background: inputText.trim()
                  ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                  : 'rgba(30,41,59,0.8)',
                border: '1px solid rgba(99,102,241,0.3)',
                opacity: loading || !inputText.trim() ? 0.5 : 1,
              }}
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" opacity={inputText.trim() ? 1 : 0.4}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bounce keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
