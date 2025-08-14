import type { Message } from '../../types'

interface CreateParams {
  apiKey: string
  model: string
  messages: Message[]
}

export async function createGeminiChatCompletion(params: CreateParams): Promise<string> {
  const { apiKey, model, messages } = params
  const sys = messages.find((m) => m.role === 'system')?.content || ''
  const userContent = messages.filter((m) => m.role !== 'system').map((m) => `${m.role}: ${m.content}`).join('\n')

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${sys}\n\n${userContent}` }],
        },
      ],
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    let errorMessage = `Gemini API Error (${res.status})`
    
    try {
      const errorData = JSON.parse(text)
      if (res.status === 429) {
        errorMessage = '⏳ Rate limit exceeded. Please wait a moment and try again.'
      } else if (res.status === 400) {
        errorMessage = '❌ Invalid request. Please check your input.'
      } else if (res.status === 401 || res.status === 403) {
        errorMessage = '🔑 API key issue. Please check your Gemini API key.'
      } else if (res.status === 500) {
        errorMessage = '🔧 Gemini service temporarily unavailable. Please try again later.'
      } else {
        errorMessage = errorData.error?.message || errorMessage
      }
    } catch {
      // If we can't parse the error, use the generic message
    }
    
    throw new Error(errorMessage)
  }
  const json = await res.json()
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return text
}

export async function validateGeminiKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    return res.ok
  } catch {
    return false
  }
}

export async function listGeminiModels(apiKey: string): Promise<string[]> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
    if (!res.ok) return []
    const json: any = await res.json()
    const ids: string[] = (json.models || [])
      .map((m: any) => m.name as string)
      .filter((name: string) => Boolean(name))
      .map((name: string) => name.replace(/^models\//, ''))
      .filter((id: string) => /(gemini|flash|pro|experimental|1\.5|2\.0)/i.test(id))
      .sort()
    return ids
  } catch {
    return []
  }
}


