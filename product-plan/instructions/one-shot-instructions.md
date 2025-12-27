# Meds — Complete Implementation Instructions

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

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions include:
- Specific UI elements, button labels, and interactions to verify
- Expected success and failure behaviors
- Empty state handling (when no records exist yet)
- Data assertions and state validations

---

## Product Overview

A simple medication inventory app for households to track what medications they own and when they expire. Helps users see expiration dates at a glance, avoid duplicate purchases, and maintain a central list of everything in their medicine cabinet.

**Key Features:**
- Medication inventory list with presentation types and expiration dates
- Multi-user support with OAuth authentication (Google, GitHub)
- Shared household access for family members

**Sections:**
1. **Inventory** — The core list of medications with names, presentation types, and expiration dates
2. **Users** — OAuth authentication and shared household access

**Data Model:**
- **Medication** — id, name, presentation, expirationDate, activeSubstanceIds
- **ActiveSubstance** — id, name
- **User** — OAuth user info (name, email, avatar)

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- Primary: `teal` — buttons, links, accents
- Secondary: `amber` — expiration warnings, highlights
- Neutral: `slate` — backgrounds, text, borders

**Typography:**
- Heading: Fraunces
- Body: Inter
- Mono: JetBrains Mono

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core entities:**
- `Medication` — id, name, presentation, expirationDate, activeSubstanceIds
- `ActiveSubstance` — id, name
- `User` — OAuth user info (name, email, avatar)

### 3. Routing Structure

Create routes for the app:

- `/` — Redirect to inventory (if authenticated) or login (if not)
- `/login` — Login screen (Users section)
- `/inventory` — Medication inventory (Inventory section)

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with header
- `Header.tsx` — Header with logo, search bar, user menu
- `SearchBar.tsx` — Search input component
- `UserMenu.tsx` — User dropdown with avatar and logout

**Wire Up:**

The shell expects these props:
- `user` — Object with `name` and optional `avatarUrl`
- `onLogout` — Callback when user clicks logout
- `onSearch` — Callback when search query changes

**Layout:**
- Desktop: Single row — Logo | Search bar | User avatar
- Mobile: Two rows — Logo + User avatar on top, full-width search bar below

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Data model types are defined
- [ ] Routes exist for login and inventory
- [ ] Shell renders with navigation
- [ ] Search bar passes query to parent
- [ ] User menu shows user info and logout works
- [ ] Responsive on mobile (search bar moves below header)

---

# Milestone 2: Inventory

## Goal

Implement the Inventory feature — the core medication list where users can view, add, edit, and delete medications.

## Overview

The Inventory section is the main view of the app. It shows all medications as compact rows with name, presentation icon, and expiration date. Users can search, sort, add new medications, edit existing ones, and delete with undo capability.

**Key Functionality:**
- View a list of all medications sorted by expiration date or name
- Search/filter by medication name or active substance
- Add new medications with inline form at top of list
- Edit medications inline with autocomplete for active substances
- Delete medications with swipe/quick action and undo toast
- Select a medication to reveal active substances and action buttons
- See expired medications highlighted in amber

## Recommended Approach: Test-Driven Development

See `product-plan/sections/inventory/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy from `product-plan/sections/inventory/components/`:

- `InventoryList.tsx` — Main list component with filtering and sorting
- `MedicationRow.tsx` — Individual medication row, expands on selection
- `AddMedicationRow.tsx` — Inline add form with substance autocomplete
- `EmptyState.tsx` — Friendly empty state when no medications exist
- `UndoToast.tsx` — Toast with undo button and countdown timer
- `PresentationIcon.tsx` — Icons for pill, syrup, nasal spray, etc.

### Data Layer

```typescript
interface Medication {
  id: string
  name: string
  presentation: 'pill' | 'syrup' | 'nasal-spray' | 'cream' | 'drops' | 'bandage'
  expirationDate: string
  activeSubstanceIds: string[]
}

interface ActiveSubstance {
  id: string
  name: string
}
```

### Callbacks

| Callback | Description |
|----------|-------------|
| `onSearchChange` | Filter medications by search query |
| `onSortChange` | Toggle between 'expiration' and 'name' sort |
| `onSelect` | Select/deselect a medication row |
| `onAdd` | Create new medication |
| `onEdit` | Update existing medication |
| `onDelete` | Soft delete (show undo toast) |
| `onDeleteConfirm` | Hard delete when undo timer expires |
| `onDeleteUndo` | Restore deleted medication |

## Expected User Flows

### Flow 1: View Inventory
User navigates to `/inventory`, sees medications sorted by expiration, expired items highlighted in amber.

### Flow 2: Add a Medication
User clicks "Add medication", fills inline form, clicks "Add", medication appears in sorted position.

### Flow 3: Edit a Medication
User selects medication, clicks "Edit", modifies fields, saves. Medication animates to new position if sort changed.

### Flow 4: Delete a Medication
User selects medication, clicks "Delete", undo toast appears. User can undo or wait for auto-confirm.

### Flow 5: Search Medications
User types in search bar, list filters by name OR active substance name.

## Done When

- [ ] Tests written and passing
- [ ] Medications display with real data
- [ ] Search, sort, add, edit, delete all work
- [ ] Empty state displays when no medications
- [ ] Expired medications highlighted
- [ ] Responsive on mobile

---

# Milestone 3: Users

## Goal

Implement OAuth authentication with Google and GitHub. Access is restricted to a hardcoded allow-list of emails.

## Overview

The Users section handles authentication. It provides a minimal login screen with OAuth buttons. Only users whose email is on the allow-list can access the app. All authenticated users share the same medication inventory.

**Key Functionality:**
- Display login screen for unauthenticated users
- OAuth login with Google and GitHub providers
- Restrict access to allow-listed emails only
- Show error message for unauthorized login attempts
- Display user info (name, avatar) in app shell after login
- Logout functionality returns to login screen

## Recommended Approach: Test-Driven Development

See `product-plan/sections/users/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy from `product-plan/sections/users/components/`:

- `LoginScreen.tsx` — Login page with OAuth buttons and error state

### Data Layer

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

### Allow-List Implementation

The app should only allow specific emails to log in:
- Environment variable, database table, or config file
- Check email after OAuth completes
- Return error if not on allow-list

## Expected User Flows

### Flow 1: Successful Login
User visits app, sees login screen, clicks OAuth button, email is allowed → redirected to inventory.

### Flow 2: Failed Login
User clicks OAuth button, email NOT allowed → error message displayed.

### Flow 3: Logout
User clicks avatar menu, clicks "Logout" → session cleared, redirected to login.

## Done When

- [ ] Tests written and passing
- [ ] OAuth works with Google and GitHub
- [ ] Allow-list restricts unauthorized emails
- [ ] Error message displays for unauthorized attempts
- [ ] User info appears in app shell
- [ ] Logout works correctly
