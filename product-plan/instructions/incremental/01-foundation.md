# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

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
