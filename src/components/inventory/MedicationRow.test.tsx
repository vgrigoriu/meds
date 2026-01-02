import { render, screen } from '@testing-library/react'
import { MedicationRow } from './MedicationRow'
import { MedicationMatcher } from '@/lib/search'
import type { Medication } from '@/types'

const mockMedication: Medication = {
  id: 1,
  name: 'Advil',
  presentation: 'pill',
  expirationYear: 2025,
  expirationMonth: 8,
  substances: [{ substanceId: 1, concentration: '200mg' }],
}

describe('MedicationRow', () => {
  it('shows substances when matcher has substance match, even if not selected', () => {
    const matcher = new MedicationMatcher('Advil', [
      { name: 'Ibuprofen', concentration: '200mg' },
    ], 'ibu')

    render(
      <MedicationRow
        medication={mockMedication}
        matcher={matcher}
        isSelected={false}
      />
    )

    // Text is split by highlight mark, so we check for the highlighted part
    expect(screen.getByText('Ibu')).toBeInTheDocument()
    expect(screen.getByText(/200mg/)).toBeInTheDocument()
  })

  it('does not show substances when no match and not selected', () => {
    const matcher = new MedicationMatcher('Advil', [
      { name: 'Ibuprofen', concentration: '200mg' },
    ], '')

    render(
      <MedicationRow
        medication={mockMedication}
        matcher={matcher}
        isSelected={false}
      />
    )

    expect(screen.queryByText(/Ibuprofen/)).not.toBeInTheDocument()
  })

  it('shows substances when selected, regardless of match', () => {
    const matcher = new MedicationMatcher('Advil', [
      { name: 'Ibuprofen', concentration: '200mg' },
    ], '')

    render(
      <MedicationRow
        medication={mockMedication}
        matcher={matcher}
        isSelected={true}
      />
    )

    expect(screen.getByText(/Ibuprofen/)).toBeInTheDocument()
    expect(screen.getByText(/200mg/)).toBeInTheDocument()
  })
})
