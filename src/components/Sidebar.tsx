import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addPersona, createThread, setActiveThread } from '../store/slices/chatsSlice'
import type { Persona } from '../types'
import { fetchGithubUser } from '../services/github'

export default function Sidebar() {
  const dispatch = useAppDispatch()
  const personas = useAppSelector((s) => s.chats.personas)
  const threads = useAppSelector((s) => s.chats.threads)
  const orderedThreadIds = useAppSelector((s) => s.chats.orderedThreadIds)
  const [showNew, setShowNew] = useState(false)

  const defaultGuruji = useMemo(() =>
    Object.values(personas).filter((p) => p.id.startsWith('guruji-')).slice(0, 3),
  [personas])

  const customPersonas = useMemo(() =>
    Object.values(personas).filter((p) => p.id.startsWith('custom-')),
  [personas])

  const customThreads = useMemo(() =>
    orderedThreadIds
      .map(id => threads[id])
      .filter(thread => thread && personas[thread.personaId]?.id.startsWith('custom-'))
      .slice(0, 10), // Limit to 10 recent custom chats
  [orderedThreadIds, threads, personas])



  async function handleCreateNewPersona(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const username = String(form.get('username') || '').trim()
    const displayName = String(form.get('displayName') || '').trim()
    const description = String(form.get('description') || '').trim()
    const systemPrompt = String(form.get('persona') || '').trim()

    const gh = username ? await fetchGithubUser(username) : null
    const persona: Persona = {
      id: `custom-${Date.now()}`,
      displayName: displayName || gh?.name || username || 'New Guruji',
      githubUsername: username,
      description: description || gh?.bio,
      systemPrompt: systemPrompt || 'You are a helpful AI assistant called Guruji.'
    }
    if (gh?.avatar_url) persona.avatarUrl = gh.avatar_url
    dispatch(addPersona(persona))
    dispatch(createThread({ personaId: persona.id, title: persona.displayName }))
    setShowNew(false)
    e.currentTarget.reset()
    // persistence is handled via store subscription
  }

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
      <div className="mb-3 text-lg font-semibold">Guruji</div>
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

      <button onClick={() => setShowNew((v) => !v)} className="mb-3 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium hover:bg-brand-500">Create new chat</button>
      {showNew && (
        <form onSubmit={handleCreateNewPersona} className="space-y-2 rounded-md border border-gray-800 p-3">
          <label className="block text-sm">
            <span className="text-gray-300">Git username</span>
            <input name="username" className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 p-2" placeholder="octocat" />
          </label>
          <label className="block text-sm">
            <span className="text-gray-300">Display name</span>
            <input name="displayName" className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 p-2" placeholder="Guruji Name" />
          </label>
          <label className="block text-sm">
            <span className="text-gray-300">Description</span>
            <input name="description" className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 p-2" placeholder="Short intro" />
          </label>
          <label className="block text-sm">
            <span className="text-gray-300">Persona (system prompt)</span>
            <textarea name="persona" rows={4} className="mt-1 w-full rounded-md border border-gray-700 bg-gray-900 p-2" placeholder="Describe how this Guruji should respond" />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowNew(false)} className="rounded-md px-3 py-2 text-sm">Cancel</button>
            <button type="submit" className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium hover:bg-brand-500">Create</button>
          </div>
        </form>
      )}

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
    </div>
  )
}


