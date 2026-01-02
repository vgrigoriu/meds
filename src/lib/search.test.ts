import { matchText, MedicationMatcher } from './search'

describe('matchText', () => {
  it('returns null for empty query', () => {
    expect(matchText('paracetamol', '')).toBeNull()
    expect(matchText('paracetamol', '   ')).toBeNull()
  })

  it('returns null when no match', () => {
    expect(matchText('paracetamol', 'ibuprofen')).toBeNull()
  })

  it('returns match at start of string', () => {
    const result = matchText('paracetamol', 'para')
    expect(result).toEqual({ spans: [{ start: 0, length: 4 }] })
  })

  it('returns match in middle of string', () => {
    const result = matchText('paracetamol', 'ceta')
    expect(result).toEqual({ spans: [{ start: 4, length: 4 }] })
  })

  it('returns match at end of string', () => {
    const result = matchText('paracetamol', 'mol')
    expect(result).toEqual({ spans: [{ start: 8, length: 3 }] })
  })

  it('is case insensitive', () => {
    expect(matchText('Paracetamol', 'para')).toEqual({ spans: [{ start: 0, length: 4 }] })
    expect(matchText('paracetamol', 'PARA')).toEqual({ spans: [{ start: 0, length: 4 }] })
    expect(matchText('PARACETAMOL', 'Para')).toEqual({ spans: [{ start: 0, length: 4 }] })
  })

  it('matches text with diacritics when query has no diacritics', () => {
    expect(matchText('Aspirină', 'aspirina')).toEqual({ spans: [{ start: 0, length: 8 }] })
    expect(matchText('Aspirină', 'rina')).toEqual({ spans: [{ start: 4, length: 4 }] })
    expect(matchText('Șampon', 'sampon')).toEqual({ spans: [{ start: 0, length: 6 }] })
  })

  it('does not match text without diacritics when query has diacritics', () => {
    expect(matchText('sampon', 'șampon')).toBeNull()
    expect(matchText('Aspirina', 'ină')).toBeNull()
  })

  it('matches text with diacritics when query has same diacritics', () => {
    expect(matchText('Aspirină', 'rină')).toEqual({ spans: [{ start: 4, length: 4 }] })
    expect(matchText('Șampon', 'Șam')).toEqual({ spans: [{ start: 0, length: 3 }] })
  })
})

describe('MedicationMatcher', () => {
  describe('matches', () => {
    it('returns true when medication name matches', () => {
      const matcher = new MedicationMatcher('Parasinus', [], 'sinus')
      expect(matcher.matches()).toBe(true)
    })

    it('returns true when a substance matches', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
      ], 'ceta')
      expect(matcher.matches()).toBe(true)
    })

    it('returns false when nothing matches', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
      ], 'ibuprofen')
      expect(matcher.matches()).toBe(false)
    })

    it('returns false for empty query', () => {
      const matcher = new MedicationMatcher('Parasinus', [], '')
      expect(matcher.matches()).toBe(false)
    })
  })

  describe('hasSubstanceMatch', () => {
    it('returns true when a substance matches', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
      ], 'para')
      expect(matcher.hasSubstanceMatch()).toBe(true)
    })

    it('returns false when only medication name matches', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
      ], 'sinus')
      expect(matcher.hasSubstanceMatch()).toBe(false)
    })

    it('returns false when nothing matches', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
      ], 'ibuprofen')
      expect(matcher.hasSubstanceMatch()).toBe(false)
    })
  })

  describe('getSubstances', () => {
    it('returns all substances with highlights for matches', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
        { name: 'Cafeină', concentration: '65mg' },
      ], 'ceta')
      const result = matcher.getSubstances()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        name: 'Paracetamol',
        concentration: '500mg',
        match: { spans: [{ start: 4, length: 4 }] },
      })
      expect(result[1]).toEqual({
        name: 'Cafeină',
        concentration: '65mg',
        match: null,
      })
    })

    it('returns all substances with null matches for empty query', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
      ], '')
      const result = matcher.getSubstances()

      expect(result).toHaveLength(1)
      expect(result[0].match).toBeNull()
    })

    it('returns all substances with null matches when query matches only name', () => {
      const matcher = new MedicationMatcher('Parasinus', [
        { name: 'Paracetamol', concentration: '500mg' },
      ], 'sinus')
      const result = matcher.getSubstances()

      expect(result).toHaveLength(1)
      expect(result[0].match).toBeNull()
    })
  })
})
