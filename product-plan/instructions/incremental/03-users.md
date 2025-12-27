# Milestone 3: Users

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 2 (Inventory) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements)
- Design system tokens (colors, typography)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement OAuth authentication with Google and GitHub. Access is restricted to a hardcoded allow-list of emails.

## Overview

The Users section handles authentication. It provides a minimal login screen with OAuth buttons. Only users whose email is on the allow-list can access the app. All authenticated users share the same medication inventory (no per-user data separation).

**Key Functionality:**
- Display login screen for unauthenticated users
- OAuth login with Google and GitHub providers
- Restrict access to allow-listed emails only
- Show error message for unauthorized login attempts
- Display user info (name, avatar) in app shell after login
- Logout functionality returns to login screen

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/users/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section component from `product-plan/sections/users/components/`:

- `LoginScreen.tsx` — Login page with OAuth buttons and error state

### Data Layer

The component expects these data shapes (see `types.ts`):

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

You'll need to:
- Set up OAuth with Google and GitHub
- Create/configure allow-list of permitted emails
- Store user session after successful auth
- Provide user info to app shell (name, avatar from OAuth profile)

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onLogin` | Initiate OAuth flow with specified provider |

The login screen is standalone (no shell) — it renders at `/login` for unauthenticated users.

### Allow-List Implementation

The app should only allow specific emails to log in. Options:
- Environment variable with comma-separated emails
- Database table of allowed emails
- Configuration file

When an unauthorized email attempts to log in:
1. OAuth succeeds (they authenticate with Google/GitHub)
2. Your backend checks if email is in allow-list
3. If not allowed, return error and don't create session
4. Login screen shows error message

## Files to Reference

- `product-plan/sections/users/README.md` — Feature overview and design intent
- `product-plan/sections/users/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/users/components/` — React components
- `product-plan/sections/users/types.ts` — TypeScript interfaces
- `product-plan/sections/users/sample-data.json` — Sample error message

## Expected User Flows

### Flow 1: Successful Login (Authorized User)

1. User visits app and is redirected to `/login`
2. User sees "Meds" logo and two OAuth buttons (Google, GitHub)
3. User clicks "Continue with Google" (or GitHub)
4. OAuth flow completes, user's email is on allow-list
5. **Outcome:** User is redirected to `/inventory`, user info appears in header

### Flow 2: Failed Login (Unauthorized User)

1. User visits app and is redirected to `/login`
2. User clicks OAuth button
3. OAuth flow completes, but email is NOT on allow-list
4. **Outcome:** Error message appears: "You don't have access to this app..."

### Flow 3: Logout

1. User is logged in, viewing inventory
2. User clicks avatar in header to open user menu
3. User clicks "Logout"
4. **Outcome:** Session is cleared, user is redirected to `/login`

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Login screen renders at `/login`
- [ ] OAuth works with Google
- [ ] OAuth works with GitHub
- [ ] Allow-list restricts unauthorized emails
- [ ] Error message displays for unauthorized attempts
- [ ] Successful login redirects to inventory
- [ ] User info (name, avatar) appears in app shell
- [ ] Logout clears session and returns to login
- [ ] Loading state shows during OAuth flow
