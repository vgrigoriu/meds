# Inventory Section

The main view showing all medications as compact rows. Users can add, edit, and delete medications with inline interactions.

## Components

| Component | Description |
|-----------|-------------|
| `InventoryList` | Main container managing the medication list with search, sort, and CRUD operations |
| `MedicationRow` | Individual medication row with name, presentation icon, expiration date, and selection state |
| `AddMedicationRow` | Inline form for adding new medications with autocomplete for active substances |
| `EmptyState` | Friendly illustration shown when no medications exist |
| `UndoToast` | Toast notification with undo action for delete operations |
| `PresentationIcon` | Icon component displaying medication presentation type (pill, syrup, etc.) |

## Types

```typescript
type Presentation = 'pill' | 'syrup' | 'nasal-spray' | 'cream' | 'drops' | 'bandage'

interface Medication {
  id: string
  name: string
  presentation: Presentation
  expirationDate: string
  activeSubstanceIds: string[]
}

interface ActiveSubstance {
  id: string
  name: string
}
```

## Key Features

- **Compact rows**: Name + presentation icon + expiration date
- **Selection**: Tap to reveal active substances and edit/delete buttons
- **Expired highlighting**: Amber background for expired medications
- **Search**: Filter by medication name or active substance
- **Sort**: Toggle between expiration date (default) and name
- **Inline add**: New row at top, animates to sorted position after save
- **Inline edit**: Edit in place, animates if position changes
- **Delete with undo**: Swipe/quick action with 5-second undo window

## Usage

```tsx
import { InventoryList } from './components'

<InventoryList
  medications={medications}
  activeSubstances={activeSubstances}
  searchQuery=""
  sortBy="expiration"
  selectedId={null}
  onSearchChange={(query) => {}}
  onSortChange={(sortBy) => {}}
  onSelect={(id) => {}}
  onAdd={(medication) => {}}
  onEdit={(id, updates) => {}}
  onDelete={(id) => {}}
  onDeleteConfirm={(id) => {}}
  onDeleteUndo={(id) => {}}
/>
```
