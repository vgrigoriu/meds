// =============================================================================
// Data Types
// =============================================================================

export type OAuthProvider = 'google' | 'github'

export interface AuthError {
  message: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface LoginScreenProps {
  /** Error to display (e.g., unauthorized email) */
  error?: AuthError | null
  /** Whether a login is currently in progress */
  isLoading?: boolean
  /** Called when user clicks an OAuth provider button */
  onLogin?: (provider: OAuthProvider) => void
}
