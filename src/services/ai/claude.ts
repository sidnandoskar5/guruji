import type { Message } from '../../types'
import { parseAPIError } from '../../utils/errorHandler'

interface CreateParams {
  apiKey: string
  model: string
  messages: Message[]
}

export async function createClaudeChatCompletion(params: CreateParams): Promise<string> {
  const { apiKey, model, messages } = params
  
  // Claude API expects system message separate from messages
  const systemMessage = messages.find((m) => m.role === 'system')?.content || ''
  const conversationMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }))

  const payload = {
    model,
    max_tokens: 4096,
    messages: conversationMessages,
    ...(systemMessage && { system: systemMessage }),
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(payload),
  })
  
  if (!res.ok) {
    const text = await res.text()
    const formattedError = parseAPIError({ status: res.status, message: text }, 'Claude')
    throw new Error(formattedError)
  }
  
  const json = await res.json()
  return json.content?.[0]?.text ?? ''
}

export async function validateClaudeKey(apiKey: string): Promise<boolean> {
  try {
    // Claude doesn't have a models endpoint, so we'll make a simple completion request
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }],
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function listClaudeModels(apiKey: string): Promise<string[]> {
  // Claude doesn't have a models endpoint, so we'll return the known models
  return [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-sonnet-20240620',
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
  ]
}
