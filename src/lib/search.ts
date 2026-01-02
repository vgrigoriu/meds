// Represents a single matched span within text
export interface MatchSpan {
  start: number
  length: number
}

// Match result - null means no match, otherwise contains spans to highlight
export interface MatchResult {
  spans: MatchSpan[]
}

// Remove diacritics using Unicode NFD normalization
function removeDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Check if a string contains diacritics
function hasDiacritics(str: string): boolean {
  return /[\u0300-\u036f]/u.test(str.normalize('NFD'))
}

// Core matching function - single source of truth
export function matchText(text: string, query: string): MatchResult | null {
  if (!query.trim()) return null

  const lowerQuery = query.toLowerCase()
  const lowerText = text.toLowerCase()

  // If query has no diacritics, search in normalized text
  // If query has diacritics, search in original text (exact match)
  const searchText = hasDiacritics(query) ? lowerText : removeDiacritics(lowerText)

  const index = searchText.indexOf(lowerQuery)
  if (index === -1) return null
  return { spans: [{ start: index, length: query.length }] }
}

// Substance with resolved name
export interface ResolvedSubstance {
  name: string
  concentration: string | null
}

// Substance with match result for highlighting
export interface SubstanceWithHighlights {
  name: string
  concentration: string | null
  match: MatchResult | null
}

// Medication matcher - encapsulates a medication and provides match methods
export class MedicationMatcher {
  private readonly nameMatch: MatchResult | null
  private readonly substancesWithHighlights: SubstanceWithHighlights[]

  constructor(
    name: string,
    substances: ResolvedSubstance[],
    query: string
  ) {
    this.nameMatch = matchText(name, query)
    this.substancesWithHighlights = substances.map((s) => ({
      name: s.name,
      concentration: s.concentration,
      match: matchText(s.name, query),
    }))
  }

  // Does the medication match in any way? (name or any substance)
  matches(): boolean {
    return this.nameMatch !== null || this.hasSubstanceMatch()
  }

  // Does any substance match?
  hasSubstanceMatch(): boolean {
    return this.substancesWithHighlights.some((s) => s.match !== null)
  }

  // Get all substances with their match results
  getSubstances(): SubstanceWithHighlights[] {
    return this.substancesWithHighlights
  }
}
