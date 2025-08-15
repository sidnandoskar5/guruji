import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setProvider } from '../store/slices/settingsSlice'
import ProviderConfigForm from './ProviderConfigForm'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch()
  const currentProvider = useAppSelector((s) => s.settings.provider)

  const handleSubmit = async (config: { name: any; model: string; apiKey: string }) => {
    dispatch(setProvider(config))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6">
      <ProviderConfigForm
        initialConfig={{
          name: currentProvider.name || 'openai',
          model: currentProvider.model || 'gpt-4o-mini',
          apiKey: currentProvider.apiKey || ''
        }}
        onSubmit={handleSubmit}
        onCancel={onClose}
        title="Settings"
      />
    </div>
  )
}
