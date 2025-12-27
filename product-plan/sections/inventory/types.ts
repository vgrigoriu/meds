// =============================================================================
// Data Types
// =============================================================================

export type Presentation =
  | 'pill'
  | 'syrup'
  | 'nasal-spray'
  | 'cream'
  | 'drops'
  | 'bandage'

export interface ActiveSubstance {
  id: string
  name: string
}

export interface Medication {
  id: string
  name: string
  presentation: Presentation
  expirationDate: string
  activeSubstanceIds: string[]
}

// =============================================================================
// Component Props
// =============================================================================

export type SortOption = 'expiration' | 'name'

export interface InventoryProps {
  /** The list of medications to display */
  medications: Medication[]
  /** All known active substances (for autocomplete and display) */
  activeSubstances: ActiveSubstance[]
  /** Current search query */
  searchQuery?: string
  /** Current sort option */
  sortBy?: SortOption
  /** Currently selected medication ID */
  selectedId?: string | null
  /** Called when search query changes */
  onSearchChange?: (query: string) => void
  /** Called when sort option changes */
  onSortChange?: (sortBy: SortOption) => void
  /** Called when a medication is selected */
  onSelect?: (id: string | null) => void
  /** Called when user wants to add a new medication */
  onAdd?: (medication: Omit<Medication, 'id'>) => void
  /** Called when user wants to edit a medication */
  onEdit?: (id: string, medication: Partial<Omit<Medication, 'id'>>) => void
  /** Called when user wants to delete a medication */
  onDelete?: (id: string) => void
  /** Called when user dismisses the undo toast (confirms deletion) */
  onDeleteConfirm?: (id: string) => void
  /** Called when user clicks undo after deleting */
  onDeleteUndo?: (id: string) => void
}
