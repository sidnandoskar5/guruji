import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { createThread, setActiveThread } from '../store/slices/chatsSlice'
import SettingsModal from './SettingsModal'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const personas = useAppSelector((s) => s.chats.personas)
  const threads = useAppSelector((s) => s.chats.threads)
  const orderedThreadIds = useAppSelector((s) => s.chats.orderedThreadIds)
  const [showSettings, setShowSettings] = useState(false)

  const defaultGuruji = useMemo(() =>
    Object.values(personas).filter((p) => p.id.startsWith('guruji-')).slice(0, 3),
  [personas])



  const customThreads = useMemo(() =>
    orderedThreadIds
      .map(id => threads[id])
      .filter(thread => thread && personas[thread.personaId]?.id.startsWith('custom-'))
      .slice(0, 10), // Limit to 10 recent custom chats
  [orderedThreadIds, threads, personas])





  function handleOpenDefault(personaId: string, title: string) {
    // Check if there's already an existing thread for this persona
    const existingThread = orderedThreadIds
      .map(id => threads[id])
      .find(thread => thread && thread.personaId === personaId)
    
    if (existingThread) {
      // Switch to existing thread
      dispatch(setActiveThread(existingThread.id))
    } else {
      // Create new thread if none exists
      dispatch(createThread({ personaId, title }))
    }
  }

  function handleOpenCustomThread(threadId: string) {
    dispatch(setActiveThread(threadId))
  }

  return (
    <div className="flex w-80 flex-col border-r border-gray-800 bg-gray-900 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-lg font-semibold">Guruji</div>
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-md p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          title="Settings"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <div className="mb-2 text-sm uppercase text-gray-400">Default Gurujis</div>
      <div className="mb-4 space-y-1">
        {defaultGuruji.map((p) => (
          <button key={p.id} onClick={() => handleOpenDefault(p.id, p.displayName)} className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-gray-800">
            {p.avatarUrl ? (
              <img src={p.avatarUrl} alt={p.displayName} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-bold">
                {p.displayName[0]?.toUpperCase()}
              </span>
            )}
            <div className="flex-1 text-left">
              <div className="font-medium">{p.displayName}</div>
              <div className="text-xs text-gray-400">{p.description || 'Tap to chat'}</div>
            </div>
          </button>
        ))}
      </div>



      {/* Custom Chats Section */}
      {customThreads.length > 0 && (
        <>
          <div className="mb-2 mt-4 text-sm uppercase text-gray-400">Custom Chats</div>
          <div className="space-y-1">
            {customThreads.map((thread) => {
              if (!thread) return null
              const persona = personas[thread.personaId]
              if (!persona) return null
              const lastMessage = thread.messages.length > 0 ? thread.messages[thread.messages.length - 1] : undefined
              const lastUserOrAssistantMessage = thread.messages.filter(m => m.role !== 'system').slice(-1)[0]
              
              return (
                <button
                  key={thread.id}
                  onClick={() => handleOpenCustomThread(thread.id)}
                  className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-gray-800"
                >
                  {persona.avatarUrl ? (
                    <img src={persona.avatarUrl} alt={persona.displayName} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm font-bold">
                      {persona.displayName[0]?.toUpperCase()}
                    </span>
                  )}
                  <div className="flex-1 truncate text-left">
                    <div className="truncate text-sm font-medium">{thread.title}</div>
                    <div className="truncate text-xs text-gray-400">
                      {lastUserOrAssistantMessage?.content || 'New chat'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}


