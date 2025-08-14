import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setProvider } from '../store/slices/settingsSlice'
import type { ProviderName } from '../types'
import { validateOpenAiKey, listOpenAiModels } from '../services/ai/openai'
import { validateGeminiKey, listGeminiModels } from '../services/ai/gemini'
import { validateGroqKey, listGroqModels } from '../services/ai/groq'
import { validateClaudeKey, listClaudeModels } from '../services/ai/claude'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch()
  const currentProvider = useAppSelector((s) => s.settings.provider)
  
  const [provider, setProviderState] = useState<ProviderName>(currentProvider.name as ProviderName || 'openai')
  const [model, setModel] = useState(currentProvider.model || 'gpt-4o-mini')
  const [apiKey, setApiKey] = useState(currentProvider.apiKey || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  // Initialize form with current settings when modal opens
  useEffect(() => {
    if (isOpen) {
      setProviderState(currentProvider.name as ProviderName || 'openai')
      setModel(currentProvider.model || 'gpt-4o-mini')
      setApiKey(currentProvider.apiKey || '')
      setError(null)
    }
  }, [isOpen, currentProvider])

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
  }, [provider, apiKey])

  function handleProviderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setProviderState(e.target.value as ProviderName)
    setModel('')
    setApiKey('')
  }

  async function handleSave(e: React.FormEvent) {
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
      }
      if (!ok) throw new Error('Invalid API Key or network error')
      dispatch(setProvider({ name: provider, model, apiKey }))
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to validate key')
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6">
      <form onSubmit={handleSave} className="w-full max-w-lg rounded-xl bg-gray-800 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-200">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
          </select>
        </label>

        {/* 2. API Key */}
        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-gray-300">API Key</span>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              provider === 'openai' ? 'sk-...' :
              provider === 'gemini' ? 'AIza...' :
              provider === 'groq' ? 'gsk_...' :
              provider === 'claude' ? 'sk-ant-...' : 'API Key'
            }
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
              placeholder={
                provider === 'openai' ? 'gpt-4o-mini' :
                provider === 'gemini' ? 'gemini-1.5-flash' :
                provider === 'groq' ? 'llama3-8b-8192' :
                provider === 'claude' ? 'claude-3-5-sonnet-20241022' : 'Model name'
              }
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
          <button type="button" onClick={handleClose} className="rounded-md px-4 py-2 text-sm text-gray-400 hover:text-gray-200">
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading || !provider || !apiKey || !model || loadingModels} 
            className="rounded-md bg-brand-600 px-4 py-2 font-medium hover:bg-brand-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
