// =============================================================================
// Data Types
// =============================================================================

export type Presentation =
  | 'pill'
  | 'syrup'
  | 'nasal-spray'
  | 'cream'
  | 'drops'
  | 'bandage'

export interface ActiveSubstance {
  id: string
  name: string
}

export interface Medication {
  id: string
  name: string
  presentation: Presentation
  expirationDate: string
  activeSubstanceIds: string[]
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
