import type { Message } from '../../types'

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
    let errorMessage = `Claude API Error (${res.status})`
    
    try {
      const errorData = JSON.parse(text)
      if (res.status === 429) {
        errorMessage = '⏳ Rate limit exceeded. Please wait a moment and try again.'
      } else if (res.status === 400) {
        errorMessage = '❌ Invalid request. Please check your input or model name.'
      } else if (res.status === 401) {
        errorMessage = '🔑 Invalid API key. Please check your Claude API key.'
      } else if (res.status === 403) {
        errorMessage = '🚫 Access denied. Please check your API key permissions.'
      } else if (res.status === 404) {
        errorMessage = '❓ Model not found. Please check your model name.'
      } else if (res.status === 500) {
        errorMessage = '🔧 Claude service temporarily unavailable. Please try again later.'
      } else {
        errorMessage = errorData.error?.message || errorMessage
      }
    } catch {
      // If we can't parse the error, use the generic message
    }
    
    throw new Error(errorMessage)
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
