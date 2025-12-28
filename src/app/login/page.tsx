import { Suspense } from 'react'
import { LoginClient } from './client'

interface LoginPageProps {
  searchParams: Promise<{ error?: string; signedOut?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, signedOut } = await searchParams

  return (
    <Suspense>
      <LoginClient error={error} signedOut={!!signedOut} />
    </Suspense>
  )
}
