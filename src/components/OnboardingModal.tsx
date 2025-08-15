import { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { hydrateFromStorage as hydrateSettings, setProvider } from '../store/slices/settingsSlice'
import ProviderConfigForm from './ProviderConfigForm'

export default function OnboardingModal() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(hydrateSettings())
  }, [dispatch])

  const handleSubmit = async (config: { name: any; model: string; apiKey: string }) => {
    dispatch(setProvider(config))
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/70 p-6">
      <ProviderConfigForm
        initialConfig={{
          name: 'openai',
          model: 'gpt-4o-mini',
          apiKey: ''
        }}
        onSubmit={handleSubmit}
        submitButtonText="Save & Continue"
        loadingButtonText="Validating..."
        showCancelButton={false}
        title="Welcome to Guruji"
      />
    </div>
  )
}


