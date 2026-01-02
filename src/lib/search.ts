// Represents a single matched span within text
export interface MatchSpan {
  start: number
  length: number
}

// Match result - null means no match, otherwise contains spans to highlight
export interface MatchResult {
  spans: MatchSpan[]
}

// Core matching function - single source of truth
export function matchText(text: string, query: string): MatchResult | null {
  if (!query.trim()) return null
  const index = text.toLowerCase().indexOf(query.toLowerCase())
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
