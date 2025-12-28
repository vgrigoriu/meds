// =============================================================================
// Data Types
// =============================================================================

export type Presentation = 'pill' | 'syrup' | 'spray' | 'cream' | 'drops' | 'other'

export const presentationLabels: Record<Presentation, string> = {
  pill: 'Comprimat',
  syrup: 'Sirop',
  spray: 'Spray',
  cream: 'Cremă',
  drops: 'Picături',
  other: 'Altele',
}

export interface ActiveSubstance {
  id: number
  name: string
}

export interface MedicationSubstance {
  substanceId: number
  concentration: string | null
}

export interface Medication {
  id: number
  name: string
  presentation: Presentation
  expirationYear: number
  expirationMonth: number
  substances: MedicationSubstance[]
}

export interface User {
  name: string
  email?: string
  avatarUrl?: string
}

export type OAuthProvider = 'google' | 'github'

export interface AuthError {
  message: string
}
