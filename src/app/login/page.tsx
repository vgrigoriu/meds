'use client'

import { useRouter } from 'next/navigation'
import { LoginScreen } from '@/components/users/LoginScreen'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = () => {
    // Fake login for foundation phase - navigates directly to inventory
    // Will be replaced with real OAuth in Users milestone
    router.push('/inventory')
  }

  return <LoginScreen onLogin={handleLogin} />
}
