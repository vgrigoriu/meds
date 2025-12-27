# Users Section

Simple OAuth authentication with Google and GitHub. Access is restricted to a hardcoded allow-list of emails.

## Components

| Component | Description |
|-----------|-------------|
| `LoginScreen` | Full-page login with OAuth buttons and error handling |

## Types

```typescript
type OAuthProvider = 'google' | 'github'

interface AuthError {
  message: string
}

interface LoginScreenProps {
  error?: AuthError | null
  isLoading?: boolean
  onLogin?: (provider: OAuthProvider) => void
}
```

## Key Features

- **OAuth providers**: Google and GitHub
- **Invite-only**: Hardcoded allow-list of emails
- **Error handling**: Clear message for unauthorized users
- **Loading state**: Spinner during OAuth flow
- **User info**: Name and avatar from OAuth provider displayed in shell

## Usage

```tsx
import { LoginScreen } from './components'

<LoginScreen
  error={null}
  isLoading={false}
  onLogin={(provider) => {
    // Initiate OAuth flow for provider
  }}
/>
```

## Implementation Notes

The authentication flow should:

1. User clicks Google or GitHub button
2. Redirect to OAuth provider
3. On callback, check email against allow-list
4. If allowed: create session, redirect to Inventory
5. If denied: show error message on login screen
6. Store user info (name, avatar) for shell display
