import { useEffect } from 'react'
import Sidebar from './Sidebar'
import ThreadView from './ThreadView'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { hydrateFromStorage as hydrateChats, updatePersona } from '../store/slices/chatsSlice'
import { hydrateFromStorage as hydrateSettings } from '../store/slices/settingsSlice'
import { fetchGithubUser } from '../services/github'

export default function ChatLayout() {
  const dispatch = useAppDispatch()
  const activeThreadId = useAppSelector((s) => s.chats.activeThreadId)

  const personas = useAppSelector((s) => s.chats.personas)

  useEffect(() => {
    dispatch(hydrateChats())
    dispatch(hydrateSettings())
  }, [dispatch])

  useEffect(() => {
    const defaultIds = ['guruji-hitesh', 'guruji-piyush', 'guruji-akshay']
    defaultIds.forEach(async (id) => {
      const persona = personas[id]
      if (persona && persona.githubUsername) {
        // Check if we need to fetch GitHub data (missing name, bio, or avatar)
        const needsUpdate = !persona.avatarUrl || persona.displayName === 'Hitesh' || persona.displayName === 'Piyush' || persona.displayName === 'Akshay'
        
        if (needsUpdate) {
          const gh = await fetchGithubUser(persona.githubUsername)
          if (gh) {
            const updatedPersona = {
              ...persona,
              displayName: gh.name || gh.login || persona.displayName,
              description: gh.bio || undefined,
              avatarUrl: gh.avatar_url || persona.avatarUrl,
            }
            dispatch(updatePersona(updatedPersona))
          }
        }
      }
    })
  }, [dispatch, personas])

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <div className="flex min-w-0 flex-1">
        {activeThreadId ? (
          <ThreadView threadId={activeThreadId} />
        ) : (
          <div className="m-auto text-center text-gray-400">Select a Guruji or start a new chat</div>
        )}
      </div>
    </div>
  )
}


