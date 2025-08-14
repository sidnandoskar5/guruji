import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './slices/settingsSlice'
import chatsReducer from './slices/chatsSlice'

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    chats: chatsReducer,
  },
})

// Persist chats slice to localStorage
store.subscribe(() => {
  const state = store.getState()
  try {
    const subset = {
      personas: state.chats.personas,
      threads: state.chats.threads,
      orderedThreadIds: state.chats.orderedThreadIds,
      activeThreadId: state.chats.activeThreadId,
    }
    localStorage.setItem('guruji_chats', JSON.stringify(subset))
  } catch {}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


