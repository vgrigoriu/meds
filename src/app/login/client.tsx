'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { LoginScreen } from '@/components/users/LoginScreen'
import type { OAuthProvider, AuthError } from '@/types'

export function LoginClient() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  const error: AuthError | null = errorParam
    ? {
        message:
          errorParam === 'AccessDenied'
            ? "You don't have access to this app. Contact the administrator if you think this is a mistake."
            : 'An error occurred during sign in. Please try again.',
      }
    : null

  const handleLogin = (provider: OAuthProvider) => {
    signIn(provider, { callbackUrl: '/inventory' })
  }

  return <LoginScreen error={error} onLogin={handleLogin} />
}
