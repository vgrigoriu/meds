'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { LoginScreen } from '@/components/users/LoginScreen'
import { Toast } from '@/components/Toast'
import type { OAuthProvider, AuthError } from '@/types'

interface LoginClientProps {
  error?: string
  signedOut: boolean
}

export function LoginClient({ error: errorParam, signedOut }: LoginClientProps) {
  const [showToast, setShowToast] = useState(signedOut)

  const toastDuration = 4000 // 2s visible + 2s fade

  useEffect(() => {
    if (signedOut) {
      const timer = setTimeout(() => setShowToast(false), toastDuration + 500)
      return () => clearTimeout(timer)
    }
  }, [signedOut])

  const error: AuthError | null = errorParam
    ? {
        message:
          errorParam === 'AccessDenied'
            ? 'Nu ești printre cei aleși.'
            : 'S-a produs o distorsiune a degajamentului.',
      }
    : null

  const handleLogin = (provider: OAuthProvider) => {
    signIn(provider, { callbackUrl: '/inventory' })
  }

  return (
    <>
      <LoginScreen error={error} onLogin={handleLogin} />
      {showToast && <Toast message="De ce-ai plecat? De ce-ai mai fi rămas?" duration={toastDuration} />}
    </>
  )
}
