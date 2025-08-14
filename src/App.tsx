import { useAppSelector } from './store/hooks'
import OnboardingModal from './components/OnboardingModal'
import ChatLayout from './components/ChatLayout'

export default function App() {
  const hasProvider = useAppSelector((s) => !!s.settings.provider.apiKey && !!s.settings.provider.name && !!s.settings.provider.model)
  return hasProvider ? <ChatLayout /> : <OnboardingModal />
}


