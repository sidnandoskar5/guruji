import { useState } from 'react'
import { getAllPersonaConfigs, updatePersonaConfig, PersonaConfig } from '../config/personas'

export default function PersonaSettings() {
  const [personaConfigs, setPersonaConfigs] = useState<PersonaConfig[]>(getAllPersonaConfigs())

  const handleTogglePersona = (id: string, enabled: boolean) => {
    updatePersonaConfig(id, { enabled })
    setPersonaConfigs(getAllPersonaConfigs())
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Persona Settings</h2>
      <div className="space-y-3">
        {personaConfigs.map((config) => (
          <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h3 className="font-medium">{config.displayName}</h3>
              <p className="text-sm text-gray-500">{config.id}</p>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => handleTogglePersona(config.id, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Enabled</span>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Changes will take effect after refreshing the page.</p>
      </div>
    </div>
  )
}
