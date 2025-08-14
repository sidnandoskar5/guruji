import type { Persona } from '../types'

export function buildSystemPromptForPersona(persona: Persona): string {
  return persona.systemPrompt
}


