import { useEffect, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { hydrateFromStorage as hydrateSettings, setProvider } from '../store/slices/settingsSlice'
import type { ProviderName } from '../types'
import { validateOpenAiKey, listOpenAiModels } from '../services/ai/openai'
import { validateGeminiKey, listGeminiModels } from '../services/ai/gemini'

export default function OnboardingModal() {
  const dispatch = useAppDispatch()
  const [provider, setProviderState] = useState<ProviderName>('openai')
  const [model, setModel] = useState('gpt-4o-mini')
  const [apiKey, setApiKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [loadingModels, setLoadingModels] = useState(false)

  useEffect(() => {
    dispatch(hydrateSettings())
  }, [dispatch])

  // Fetch models dynamically when provider or key changes
  useEffect(() => {
    async function loadModels() {
      setModels([])
      if (!apiKey) return
      setLoadingModels(true)
      try {
        const list = provider === 'openai' ? await listOpenAiModels(apiKey) : await listGeminiModels(apiKey)
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const ok = provider === 'openai' ? await validateOpenAiKey(apiKey) : await validateGeminiKey(apiKey)
      if (!ok) throw new Error('Invalid API Key or network error')
      dispatch(setProvider({ name: provider, model, apiKey }))
    } catch (err: any) {
      setError(err.message || 'Failed to validate key')
    } finally {
      setLoading(false)
    }
  }

  function handleProviderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setProviderState(e.target.value as ProviderName)
    setModel('')
    setApiKey('')
  }

  const isFormValid = provider && apiKey && model && !loadingModels

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/70 p-6">
      <form onSubmit={handleSave} className="w-full max-w-lg rounded-xl bg-gray-800 p-6 shadow-xl">
        <h2 className="mb-4 text-2xl font-semibold">Welcome to Guruji</h2>
        
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
          </select>
        </label>

        {/* 2. API Key */}
        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-gray-300">API Key</span>
          <input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={provider === 'openai' ? 'sk-...' : 'AIza...'}
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
              placeholder={provider === 'openai' ? 'gpt-4o-mini' : 'gemini-1.5-flash'}
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
          <button 
            type="submit" 
            disabled={loading || !isFormValid} 
            className="rounded-md bg-brand-600 px-4 py-2 font-medium hover:bg-brand-500 disabled:opacity-50"
          >
            {loading ? 'Validating...' : 'Save & Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}


