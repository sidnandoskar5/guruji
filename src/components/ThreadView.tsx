import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addMessage } from '../store/slices/chatsSlice'
import type { Message } from '../types'
import { createOpenAiChatCompletion } from '../services/ai/openai'
import { createGeminiChatCompletion } from '../services/ai/gemini'

interface Props {
  threadId: string
}

export default function ThreadView({ threadId }: Props) {
  const dispatch = useAppDispatch()
  const thread = useAppSelector((s) => s.chats.threads[threadId])
  const persona = useAppSelector((s) => s.chats.personas[thread?.personaId || ''])
  const provider = useAppSelector((s) => s.settings.provider)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const hasGreeted = useRef<Set<string>>(new Set())

  const messages = thread?.messages || []
  const visibleMessages = useMemo(() => messages.filter(m => m.role !== 'system'), [messages])

  const prettyTitle = useMemo(() => persona?.displayName || 'Chat', [persona])

  // Greet user automatically when a thread is first opened (only system message present)
  useEffect(() => {
    async function greet() {
      if (!thread || !persona || !threadId) return
      
      // Check if we've already greeted this thread
      if (hasGreeted.current.has(threadId)) return
      
      // Only greet if there's exactly 1 system message and no assistant messages yet
      const systemMessages = messages.filter(m => m.role === 'system')
      const assistantMessages = messages.filter(m => m.role === 'assistant')
      
      if (systemMessages.length !== 1 || assistantMessages.length > 0) return
      
      // Mark this thread as greeted to prevent duplicate calls
      hasGreeted.current.add(threadId)
      
      setLoading(true)
      try {
        const greetUserMsg: Message = { id: crypto.randomUUID(), role: 'user', content: 'Greet me briefly to start the conversation. 1-2 lines. Then ask how you can help.', createdAt: Date.now() }
        const replyText = provider.name === 'openai'
          ? await createOpenAiChatCompletion({ apiKey: provider.apiKey, model: provider.model, messages: thread.messages.concat(greetUserMsg) })
          : await createGeminiChatCompletion({ apiKey: provider.apiKey, model: provider.model, messages: thread.messages.concat(greetUserMsg) })
        const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: replyText || `Hello! I'm ${persona.displayName}. How can I help you today?`, createdAt: Date.now() }
        dispatch(addMessage({ threadId, message: aiMsg }))
      } catch (e: any) {
        // For greeting errors, provide a friendly fallback without showing the error
        const fallback: Message = { 
          id: crypto.randomUUID(), 
          role: 'assistant', 
          content: `Hello! I'm ${persona.displayName}. How can I help you today?\n\n${e.message?.includes('Rate limit') ? '⏳ I had a small hiccup connecting, but I\'m ready to chat now!' : ''}`, 
          createdAt: Date.now() 
        }
        dispatch(addMessage({ threadId, message: fallback }))
      } finally {
        setLoading(false)
      }
    }
    greet()
  }, [threadId, messages, persona, provider, thread, dispatch])

  async function sendMessage() {
    const trimmed = input.trim()
    if (!trimmed || !thread) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed, createdAt: Date.now() }
    dispatch(addMessage({ threadId, message: userMsg }))
    setInput('')
    setLoading(true)
    try {
      const replyText = provider.name === 'openai'
        ? await createOpenAiChatCompletion({ apiKey: provider.apiKey, model: provider.model, messages: thread.messages.concat(userMsg) })
        : await createGeminiChatCompletion({ apiKey: provider.apiKey, model: provider.model, messages: thread.messages.concat(userMsg) })
      const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: replyText || '...', createdAt: Date.now() }
      dispatch(addMessage({ threadId, message: aiMsg }))
    } catch (e: any) {
      const errorMessage = e.message || 'Something went wrong. Please try again.'
      const errMsg: Message = { 
        id: crypto.randomUUID(), 
        role: 'assistant', 
        content: `${errorMessage}\n\n💡 You can try again by resending your message.`, 
        createdAt: Date.now() 
      }
      dispatch(addMessage({ threadId, message: errMsg }))
    } finally {
      setLoading(false)
      viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight })
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-gray-800 p-3">
        {persona?.avatarUrl ? (
          <img src={persona.avatarUrl} alt={persona.displayName} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-bold">
            {persona?.displayName?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="font-semibold">{prettyTitle}</div>
      </div>
      <div ref={viewportRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {visibleMessages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={
              'max-w-[70%] rounded-lg px-3 py-2 text-sm ' + (m.role === 'user' ? 'bg-brand-600' : 'bg-gray-800')
            }>
              {m.content}
            </div>
          </div>
        ))}
        {!visibleMessages.length && (
          <div className="text-center text-gray-400">Say hi to {persona?.displayName}. They will greet you first.</div>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-gray-800 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Type a message"
          className="flex-1 rounded-md border border-gray-700 bg-gray-900 p-2"
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} className="rounded-md bg-brand-600 px-4 py-2 font-medium hover:bg-brand-500 disabled:opacity-50">Send</button>
      </div>
    </div>
  )
}


