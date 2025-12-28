'use client'

import { Loader2 } from 'lucide-react'
import type { OAuthProvider, AuthError } from '@/types'

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// GitHub icon component
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

interface OAuthButtonProps {
  provider: OAuthProvider
  onClick?: () => void
  disabled?: boolean
}

function OAuthButton({ provider, onClick, disabled }: OAuthButtonProps) {
  const config = {
    google: {
      icon: GoogleIcon,
      className: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 dark:border-slate-600',
    },
    github: {
      icon: GitHubIcon,
      className: 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900',
    },
  }

  const { icon: Icon, className } = config[provider]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-14 h-14 flex items-center justify-center rounded-xl
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Icon className="w-6 h-6" />
    </button>
  )
}

interface LoginScreenProps {
  error?: AuthError | null
  isLoading?: boolean
  onLogin?: (provider: OAuthProvider) => void
}

export function LoginScreen({ error, isLoading, onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-teal-200/20 dark:bg-teal-800/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-amber-200/20 dark:bg-amber-800/10 blur-3xl" />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Meds
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Cioc, cioc! Cine-i?
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 px-8 py-5 border border-slate-100 dark:border-slate-800 max-w-fit mx-auto">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                {error.message}
              </p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          )}

          {/* OAuth buttons */}
          {!isLoading && (
            <div className="flex justify-center gap-4">
              <OAuthButton
                provider="google"
                onClick={() => onLogin?.('google')}
              />
              <OAuthButton
                provider="github"
                onClick={() => onLogin?.('github')}
              />
            </div>
          )}

          {/* Footer note */}
          <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
            Doar pentru cei aleși
          </p>
        </div>
      </div>
    </div>
  )
}
