# Inventory Tests

Test specifications for the Inventory section. These are framework-agnostic and describe expected behaviors.

## Display Tests

### Medication List
- [ ] Displays all medications when no search query is active
- [ ] Shows medication name, presentation icon, and expiration date for each row
- [ ] Displays empty state when no medications exist
- [ ] Highlights expired medications with amber background
- [ ] Sorts by expiration date by default
- [ ] Sorts alphabetically when name sort is selected

### Selection
- [ ] Clicking a row selects it and reveals active substances
- [ ] Selected row shows edit and delete buttons
- [ ] Clicking outside a selected row deselects it
- [ ] Clicking a different row switches selection

### Presentation Icons
- [ ] Shows pill icon for pill presentation
- [ ] Shows wine glass icon for syrup
- [ ] Shows spray can icon for nasal-spray
- [ ] Shows droplets icon for cream and drops
- [ ] Shows bandage icon for bandage

## Search Tests

- [ ] Filters medications by name (case-insensitive)
- [ ] Filters medications by active substance name
- [ ] Shows active substances on rows when search matches a substance
- [ ] Shows "no results" state when search has no matches
- [ ] Clears filter when search query is empty

## Add Medication Tests

- [ ] Clicking "Add medication" expands inline form at top
- [ ] Form requires medication name
- [ ] Form requires expiration date
- [ ] Presentation defaults to "pill"
- [ ] Can select different presentation types
- [ ] Active substances are optional
- [ ] Autocomplete shows existing substances while typing
- [ ] Can select multiple active substances
- [ ] Can remove selected substances
- [ ] Submit button is disabled until required fields are filled
- [ ] Clicking "Add" calls onAdd with medication data
- [ ] Form resets and collapses after successful add
- [ ] Clicking "Cancel" resets and collapses form
- [ ] New medication animates to sorted position

## Edit Medication Tests

- [ ] Clicking edit button on selected row enables inline editing
- [ ] All fields are editable: name, presentation, expiration, substances
- [ ] Save button commits changes via onEdit
- [ ] Cancel button discards changes
- [ ] Row animates to new position if sort order changes after edit

## Delete Medication Tests

- [ ] Clicking delete button on selected row triggers onDelete
- [ ] Deleted row disappears from list
- [ ] Undo toast appears at bottom of screen
- [ ] Toast shows countdown progress bar (5 seconds)
- [ ] Clicking "Undo" restores the medication via onDeleteUndo
- [ ] Toast dismisses automatically after countdown
- [ ] Clicking X on toast confirms deletion via onDeleteConfirm
- [ ] Swipe left on row triggers delete (mobile)

## Empty State Tests

- [ ] Shows friendly illustration when medication list is empty
- [ ] Shows message "Your medicine cabinet is empty"
- [ ] Shows "Add your first medication" button
- [ ] Clicking button opens add medication form

## Responsive Tests

- [ ] Layout works on mobile (320px width)
- [ ] Layout works on tablet (768px width)
- [ ] Layout works on desktop (1024px+ width)
- [ ] Touch interactions work on mobile

## Accessibility Tests

- [ ] All interactive elements are keyboard accessible
- [ ] Focus is visible on interactive elements
- [ ] Screen reader announces medication information
- [ ] Color is not the only indicator of expired status (has text too)
