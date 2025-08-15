import { useEffect, useState } from 'react'
import type { ProviderName } from '../types'
import { validateOpenAiKey, listOpenAiModels } from '../services/ai/openai'
import { validateGeminiKey, listGeminiModels } from '../services/ai/gemini'
import { validateGroqKey, listGroqModels } from '../services/ai/groq'
import { validateClaudeKey, listClaudeModels } from '../services/ai/claude'
import { validateDeepSeekKey, listDeepSeekModels } from '../services/ai/deepseek'

interface ProviderConfig {
  name: ProviderName
  model: string
  apiKey: string
}

interface Props {
  initialConfig: ProviderConfig
  onSubmit: (config: ProviderConfig) => Promise<void>
  onCancel?: () => void
  submitButtonText?: string
  loadingButtonText?: string
  showCancelButton?: boolean
  title?: string
}

export default function ProviderConfigForm({
  initialConfig,
  onSubmit,
  onCancel,
  submitButtonText = 'Save Changes',
  loadingButtonText = 'Saving...',
  showCancelButton = true,
  title = 'Settings'
}: Props) {
  const [provider, setProviderState] = useState<ProviderName>(initialConfig.name)
  const [model, setModel] = useState(initialConfig.model)
  const [apiKey, setApiKey] = useState(initialConfig.apiKey)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  // Initialize form with current settings
  useEffect(() => {
    setProviderState(initialConfig.name)
    setModel(initialConfig.model)
    setApiKey(initialConfig.apiKey)
    setError(null)
  }, [initialConfig])

  // Fetch models dynamically when provider or key changes
  useEffect(() => {
    async function loadModels() {
      setModels([])
      if (!apiKey) return
      setLoadingModels(true)
      try {
        let list: string[] = []
        switch (provider) {
          case 'openai':
            list = await listOpenAiModels(apiKey)
            break
          case 'gemini':
            list = await listGeminiModels(apiKey)
            break
          case 'groq':
            list = await listGroqModels(apiKey)
            break
          case 'claude':
            list = await listClaudeModels(apiKey)
            break
          case 'deepseek':
            list = await listDeepSeekModels(apiKey)
            break
        }
        setModels(list)
        if (list.length && !list.includes(model)) {
          const first: string | undefined = list[0]
          if (first) setModel(first)
        }
      } catch {
        // ignore; user can type model manually
      } finally {
        setLoadingModels(false)
      }
    }
    loadModels()
  }, [provider, apiKey, model])

  function handleProviderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setProviderState(e.target.value as ProviderName)
    setModel('')
    setApiKey('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      let ok = false
      switch (provider) {
        case 'openai':
          ok = await validateOpenAiKey(apiKey)
          break
        case 'gemini':
          ok = await validateGeminiKey(apiKey)
          break
        case 'groq':
          ok = await validateGroqKey(apiKey)
          break
        case 'claude':
          ok = await validateClaudeKey(apiKey)
          break
        case 'deepseek':
          ok = await validateDeepSeekKey(apiKey)
          break
      }
      if (!ok) throw new Error('Invalid API Key or network error')
      await onSubmit({ name: provider, model, apiKey })
    } catch (err: any) {
      setError(err.message || 'Failed to validate key')
    } finally {
      setLoading(false)
    }
  }

  const getApiKeyPlaceholder = () => {
    switch (provider) {
      case 'openai': return 'sk-...'
      case 'gemini': return 'AIza...'
      case 'groq': return 'gsk_...'
      case 'claude': return 'sk-ant-...'
      case 'deepseek': return 'sk-...'
      default: return 'API Key'
    }
  }

  const getModelPlaceholder = () => {
    switch (provider) {
      case 'openai': return 'gpt-4o-mini'
      case 'gemini': return 'gemini-1.5-flash'
      case 'groq': return 'llama3-8b-8192'
      case 'claude': return 'claude-3-5-sonnet-20241022'
      case 'deepseek': return 'deepseek-chat'
      default: return 'Model name'
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-xl bg-gray-800 p-6 shadow-xl">
      {title && (
        <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      )}
      
      {/* Sweet message about API keys */}
      <div className="mb-6 rounded-lg border border-brand-500/30 bg-brand-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm">
            <p className="font-medium text-brand-300 mb-1">🔑 Please use your own API key</p>
            <p className="text-gray-300 leading-relaxed">
              Our demo API keys have reached their rate limits. To ensure the best experience, please use your own API key. 
              <span className="font-medium text-green-300"> Your API keys are stored securely in your browser only</span> - we never send them to our servers.
            </p>
          </div>
        </div>
      </div>
      
      {/* 1. Provider Selection */}
      <label className="mb-4 flex flex-col gap-2">
        <span className="text-sm text-gray-300">Provider</span>
        <select
          value={provider}
          onChange={handleProviderChange}
          className="rounded-md border border-gray-600 bg-gray-900 p-2"
        >
          <option value="openai">ChatGPT (OpenAI)</option>
          <option value="gemini">Gemini</option>
          <option value="groq">Groq</option>
          <option value="claude">Claude (Anthropic)</option>
          <option value="deepseek">DeepSeek</option>
        </select>
      </label>

      {/* 2. API Key */}
      <label className="mb-4 block">
        <span className="mb-2 block text-sm text-gray-300">API Key</span>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={getApiKeyPlaceholder()}
          className="w-full rounded-md border border-gray-600 bg-gray-900 p-2"
          required
        />
      </label>

      {/* 3. Model Selection */}
      <label className="mb-4 flex flex-col gap-2">
        <span className="text-sm text-gray-300">Model</span>
        {models.length ? (
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="rounded-md border border-gray-600 bg-gray-900 p-2"
            disabled={loadingModels}
          >
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        ) : (
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={getModelPlaceholder()}
            className="rounded-md border border-gray-600 bg-gray-900 p-2 disabled:opacity-50"
            required
            disabled={!apiKey || loadingModels}
          />
        )}
        {loadingModels && <span className="text-xs text-gray-500">Loading models…</span>}
        {!apiKey && <span className="text-xs text-gray-500">Enter API key to load models</span>}
      </label>

      {error && <div className="mb-3 rounded-md border border-red-500 bg-red-900/30 p-2 text-sm text-red-300">{error}</div>}
      
      <div className="flex justify-end gap-2">
        {showCancelButton && onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="rounded-md px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={loading || !provider || !apiKey || !model || loadingModels} 
          className="rounded-md bg-brand-600 px-4 py-2 font-medium hover:bg-brand-500 disabled:opacity-50"
        >
          {loading ? loadingButtonText : submitButtonText}
        </button>
      </div>
    </form>
  )
}
