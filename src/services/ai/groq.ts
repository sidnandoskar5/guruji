import type { Message } from '../../types'
import { parseAPIError } from '../../utils/errorHandler'

interface CreateParams {
  apiKey: string
  model: string
  messages: Message[]
}

export async function createGroqChatCompletion(params: CreateParams): Promise<string> {
  const { apiKey, model, messages } = params
  const payload = {
    model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  }
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    const formattedError = parseAPIError({ status: res.status, message: text }, 'Groq')
    throw new Error(formattedError)
  }
  const json = await res.json()
  return json.choices?.[0]?.message?.content ?? ''
}

export async function validateGroqKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    return res.ok
  } catch {
    return false
  }
}

export async function listGroqModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) return []
    const json: any = await res.json()
    const ids: string[] = (json.data || [])
      .map((m: any) => m.id as string)
      .filter((id: string) => typeof id === 'string' && /(llama|mixtral|gemma|whisper)/i.test(id))
      .sort()
    return ids
  } catch {
    return []
  }
}
