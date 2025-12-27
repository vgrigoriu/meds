# Milestone 2: Inventory

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

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

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/inventory/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/inventory/components/`:

- `InventoryList.tsx` — Main list component with filtering and sorting
- `MedicationRow.tsx` — Individual medication row, expands on selection
- `AddMedicationRow.tsx` — Inline add form with substance autocomplete
- `EmptyState.tsx` — Friendly empty state when no medications exist
- `UndoToast.tsx` — Toast with undo button and countdown timer
- `PresentationIcon.tsx` — Icons for pill, syrup, nasal spray, etc.

### Data Layer

The components expect these data shapes (see `types.ts`):

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

You'll need to:
- Create database tables for medications and active substances
- Create API endpoints for CRUD operations
- Implement search/filter logic (by name and substance)
- Handle the many-to-many relationship between medications and substances

### Callbacks

Wire up these user actions:

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

### Empty States

The `EmptyState` component handles the case when no medications exist. Make sure to:
- Show empty state when medications array is empty
- Provide clear CTA to add first medication
- Handle "no results" state when search returns nothing (different message)

## Files to Reference

- `product-plan/sections/inventory/README.md` — Feature overview and design intent
- `product-plan/sections/inventory/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/inventory/components/` — React components
- `product-plan/sections/inventory/types.ts` — TypeScript interfaces
- `product-plan/sections/inventory/sample-data.json` — Test data

## Expected User Flows

### Flow 1: View Inventory

1. User navigates to `/inventory`
2. User sees list of medications sorted by expiration date (soonest first)
3. Each row shows: presentation icon, medication name, expiration date
4. Expired medications are highlighted in amber
5. **Outcome:** User can scan inventory and identify what needs attention

### Flow 2: Add a Medication

1. User clicks "Add medication" row at top of list
2. Inline form expands with: presentation selector, name input, expiration date picker
3. User optionally adds active substances (autocomplete from existing + create new)
4. User clicks "Add" button
5. **Outcome:** New medication appears in list, animates to sorted position

### Flow 3: Edit a Medication

1. User clicks on a medication row to select it
2. Row expands to show active substances + Edit and Delete buttons
3. User clicks "Edit" button
4. User modifies fields inline
5. User saves changes
6. **Outcome:** Medication updates, animates to new position if sort changed

### Flow 4: Delete a Medication

1. User selects a medication and clicks "Delete" button
2. Medication is removed from list
3. Undo toast appears with countdown timer
4. User can click "Undo" to restore, or wait for timer to expire
5. **Outcome:** Medication is deleted (or restored if undo clicked)

### Flow 5: Search Medications

1. User types in search bar (in header)
2. List filters to show matching medications
3. Matches by name OR by active substance name
4. When searching by substance, matching substances are shown on all results
5. **Outcome:** User finds specific medications quickly

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Medications display with real data from backend
- [ ] Search filters by name and active substance
- [ ] Sort toggle works (expiration vs name)
- [ ] Add medication creates new record
- [ ] Edit medication updates record
- [ ] Delete with undo works correctly
- [ ] Empty state displays when no medications
- [ ] Expired medications highlighted in amber
- [ ] Responsive on mobile
