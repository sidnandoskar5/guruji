import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ProviderConfig } from '../../types'

interface SettingsState {
  provider: ProviderConfig
}

const initialState: SettingsState = {
  provider: { name: '', model: '', apiKey: '' },
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setProvider(state, action: PayloadAction<ProviderConfig>) {
      state.provider = action.payload
      localStorage.setItem('guruji_provider', JSON.stringify(state.provider))
    },
    hydrateFromStorage(state) {
      const raw = localStorage.getItem('guruji_provider')
      if (raw) state.provider = JSON.parse(raw)
    },
    resetProvider(state) {
      state.provider = { name: '', model: '', apiKey: '' }
      localStorage.removeItem('guruji_provider')
    },
  },
})

export const { setProvider, hydrateFromStorage, resetProvider } = settingsSlice.actions
export default settingsSlice.reducer


