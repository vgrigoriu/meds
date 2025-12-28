import { filterSubstances, shouldShowAddOption } from './SubstanceAutocomplete'
import type { ActiveSubstance } from '@/types'

const testSubstances: ActiveSubstance[] = [
  { id: 1, name: 'Paracetamol' },
  { id: 2, name: 'Ibuprofen' },
  { id: 3, name: 'Aspirină' },
]

describe('filterSubstances', () => {
  it('returns all substances sorted alphabetically when query is empty', () => {
    const result = filterSubstances(testSubstances, '')
    expect(result).toHaveLength(3)
    expect(result[0].name).toBe('Aspirină')
    expect(result[1].name).toBe('Ibuprofen')
    expect(result[2].name).toBe('Paracetamol')
  })

  it('filters substances by partial match', () => {
    const result = filterSubstances(testSubstances, 'par')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Paracetamol')
  })

  it('is case-insensitive', () => {
    expect(filterSubstances(testSubstances, 'PAR')).toHaveLength(1)
    expect(filterSubstances(testSubstances, 'ibu')).toHaveLength(1)
    expect(filterSubstances(testSubstances, 'IBU')).toHaveLength(1)
  })

  it('returns empty array when no match', () => {
    expect(filterSubstances(testSubstances, 'xyz')).toHaveLength(0)
  })

  it('matches substring anywhere in name', () => {
    expect(filterSubstances(testSubstances, 'mol')).toHaveLength(1) // ParacetaMOL
    expect(filterSubstances(testSubstances, 'fen')).toHaveLength(1) // IbuproFEN
  })
})

describe('shouldShowAddOption', () => {
  it('returns false when query is empty', () => {
    expect(shouldShowAddOption(testSubstances, '')).toBe(false)
    expect(shouldShowAddOption(testSubstances, '   ')).toBe(false)
  })

  it('returns false when exact match exists (case-insensitive)', () => {
    expect(shouldShowAddOption(testSubstances, 'Paracetamol')).toBe(false)
    expect(shouldShowAddOption(testSubstances, 'paracetamol')).toBe(false)
    expect(shouldShowAddOption(testSubstances, 'PARACETAMOL')).toBe(false)
  })

  it('returns true when no exact match exists', () => {
    expect(shouldShowAddOption(testSubstances, 'Para')).toBe(true)
    expect(shouldShowAddOption(testSubstances, 'New Substance')).toBe(true)
  })

  it('returns true for partial matches (not exact)', () => {
    expect(shouldShowAddOption(testSubstances, 'Ibu')).toBe(true)
  })
})
