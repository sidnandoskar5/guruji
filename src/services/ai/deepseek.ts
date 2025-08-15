export async function validateDeepSeekKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    return response.ok
  } catch {
    return false
  }
}

export async function listDeepSeekModels(apiKey: string): Promise<string[]> {
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) throw new Error('Failed to fetch models')
    const data = await response.json()
    return data.data?.map((model: any) => model.id) || []
  } catch {
    return []
  }
}

import { parseAPIError } from '../../utils/errorHandler'

export async function createDeepSeekChatCompletion({
  apiKey,
  model,
  messages,
}: {
  apiKey: string
  model: string
  messages: Array<{ role: string; content: string }>
}): Promise<string> {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    const formattedError = parseAPIError({ status: response.status, message: error }, 'DeepSeek')
    throw new Error(formattedError)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'No response from DeepSeek'
}
