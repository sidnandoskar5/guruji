export type ProviderName = 'openai' | 'gemini'

export interface ProviderConfig {
  name: ProviderName | ''
  model: string
  apiKey: string
}

export interface Persona {
  id: string
  displayName: string
  githubUsername: string
  description?: string
  systemPrompt: string
  avatarUrl?: string
}

export interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  createdAt: number
}

export interface ChatThread {
  id: string
  personaId: string
  title: string
  messages: Message[]
  createdAt: number
}


