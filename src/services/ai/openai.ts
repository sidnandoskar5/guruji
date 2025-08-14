import type { Message } from '../../types'

/**
 * Parameters for creating an OpenAI chat completion
 */
interface CreateParams {
  /** OpenAI API key */
  apiKey: string
  /** Model name (e.g., 'gpt-4o-mini') */
  model: string
  /** Array of conversation messages */
  messages: Message[]
}

/**
 * Creates a chat completion using OpenAI's API
 * @param params - Configuration and messages for the completion
 * @returns Promise resolving to the AI response text
 * @throws Error with user-friendly message on API failure
 */
export async function createOpenAiChatCompletion(params: CreateParams): Promise<string> {
  const { apiKey, model, messages } = params
  const payload = {
    model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    let errorMessage = `OpenAI API Error (${res.status})`
    
    try {
      const errorData = JSON.parse(text)
      if (res.status === 429) {
        errorMessage = '⏳ Rate limit exceeded. Please wait a moment and try again.'
      } else if (res.status === 400) {
        errorMessage = '❌ Invalid request. Please check your input or model name.'
      } else if (res.status === 401) {
        errorMessage = '🔑 Invalid API key. Please check your OpenAI API key.'
      } else if (res.status === 403) {
        errorMessage = '🚫 Access denied. Please check your API key permissions.'
      } else if (res.status === 404) {
        errorMessage = '❓ Model not found. Please check your model name.'
      } else if (res.status === 500) {
        errorMessage = '🔧 OpenAI service temporarily unavailable. Please try again later.'
      } else {
        errorMessage = errorData.error?.message || errorMessage
      }
    } catch {
      // If we can't parse the error, use the generic message
    }
    
    throw new Error(errorMessage)
  }
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

/**
 * Validates an OpenAI API key by making a test request
 * @param apiKey - OpenAI API key to validate
 * @returns Promise resolving to true if key is valid
 */
export async function validateOpenAiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    return res.ok
  } catch {
    return false
  }
}

/**
 * Fetches available models from OpenAI API
 * @param apiKey - Valid OpenAI API key
 * @returns Promise resolving to array of model IDs
 */
export async function listOpenAiModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) return []
    const json: any = await res.json()
    const ids: string[] = (json.data || [])
      .map((m: any) => m.id as string)
      .filter((id: string) => typeof id === 'string' && /(gpt|o|chat|turbo|mini|text|omni)/i.test(id))
      .sort()
    return ids
  } catch {
    return []
  }
}


