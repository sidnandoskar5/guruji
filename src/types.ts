/**
 * Supported AI providers for chat completions
 */
export type ProviderName = 'openai' | 'gemini' | 'groq' | 'claude' | 'deepseek'

/**
 * Configuration for an AI provider
 */
export interface ProviderConfig {
  /** The AI provider name */
  name: ProviderName | ''
  /** The model to use for completions */
  model: string
  /** API key for authentication */
  apiKey: string
}

/**
 * Represents a chat persona/character with AI instructions
 */
export interface Persona {
  /** Unique identifier for the persona */
  id: string
  /** Display name shown in the UI */
  displayName: string
  /** GitHub username for fetching profile data */
  githubUsername: string
  /** Optional description of the persona */
  description?: string
  /** System prompt that defines the persona's behavior */
  systemPrompt: string
  /** Optional avatar URL from GitHub */
  avatarUrl?: string
}

/**
 * A single message in a chat conversation
 */
export interface Message {
  /** Unique identifier for the message */
  id: string
  /** Role of the message sender */
  role: 'system' | 'user' | 'assistant'
  /** Content of the message */
  content: string
  /** Timestamp when the message was created */
  createdAt: number
}

/**
 * A chat conversation thread with a specific persona
 */
export interface ChatThread {
  /** Unique identifier for the thread */
  id: string
  /** ID of the persona this thread is with */
  personaId: string
  /** Title of the conversation */
  title: string
  /** All messages in the thread */
  messages: Message[]
  /** Timestamp when the thread was created */
  createdAt: number
}


