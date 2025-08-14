import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import type { ChatThread, Message, Persona } from '../../types'

interface ChatsState {
  personas: Record<string, Persona>
  threads: Record<string, ChatThread>
  orderedThreadIds: string[]
  activeThreadId?: string
}

const defaultPersonas: Persona[] = [
  {
    id: 'guruji-hitesh',
    displayName: 'Hitesh', // Will be updated from GitHub
    githubUsername: 'hiteshchoudhary',
    systemPrompt: `You are Guruji Hitesh. Be motivating, concise, and practical. Provide steps and code where helpful.`,
  },
  {
    id: 'guruji-piyush',
    displayName: 'Piyush', // Will be updated from GitHub
    githubUsername: 'piyushgarg-dev',
    systemPrompt: `You are Guruji Piyush. Be direct, ship-focused, and value-driven. Prefer pragmatic solutions.`,
  },
  {
    id: 'guruji-akshay',
    displayName: 'Akshay', // Will be updated from GitHub
    githubUsername: 'akshaymarch7',
    systemPrompt: `You are Guruji Akshay. Optimize for UX, performance, and clarity.`,
  },
]

const personasRecord: Record<string, Persona> = Object.fromEntries(
  defaultPersonas.map((p) => [p.id, p])
)

const initialState: ChatsState = {
  personas: personasRecord,
  threads: {},
  orderedThreadIds: [],
}

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addPersona(state, action: PayloadAction<Persona>) {
      state.personas[action.payload.id] = action.payload
    },
    updatePersona(state, action: PayloadAction<Persona>) {
      state.personas[action.payload.id] = action.payload
    },
    createThread(state, action: PayloadAction<{ personaId: string; title?: string }>) {
      const id = nanoid()
      const newThread: ChatThread = {
        id,
        personaId: action.payload.personaId,
        title: action.payload.title || 'New Chat',
        messages: [
          {
            id: nanoid(),
            role: 'system',
            content: state.personas[action.payload.personaId]?.systemPrompt || '',
            createdAt: Date.now(),
          },
        ],
        createdAt: Date.now(),
      }
      state.threads[id] = newThread
      state.orderedThreadIds.unshift(id)
      state.activeThreadId = id
    },
    setActiveThread(state, action: PayloadAction<string | undefined>) {
      state.activeThreadId = action.payload
    },
    addMessage(state, action: PayloadAction<{ threadId: string; message: Message }>) {
      state.threads[action.payload.threadId]?.messages.push(action.payload.message)
    },
    hydrateFromStorage(state) {
      const raw = localStorage.getItem('guruji_chats')
      if (raw) {
        const parsed = JSON.parse(raw) as ChatsState
        state.personas = parsed.personas
        state.threads = parsed.threads
        state.orderedThreadIds = parsed.orderedThreadIds
        state.activeThreadId = parsed.activeThreadId
      }
    },
  },
})

export const { addPersona, updatePersona, createThread, setActiveThread, addMessage, hydrateFromStorage } = chatsSlice.actions

export default chatsSlice.reducer


