import { render, screen } from '@testing-library/react'
import { MedicationRow } from './MedicationRow'
import type { Medication, ActiveSubstance } from '@/types'

const mockActiveSubstances: ActiveSubstance[] = [
  { id: 1, name: 'Ibuprofen' },
  { id: 2, name: 'Acetaminophen' },
]

const mockMedication: Medication = {
  id: 1,
  name: 'Advil',
  presentation: 'pill',
  expirationYear: 2025,
  expirationMonth: 8,
  substances: [{ substanceId: 1, concentration: '200mg' }],
}

describe('MedicationRow', () => {
  it('shows substances when showSubstances is true, even if not selected', () => {
    render(
      <MedicationRow
        medication={mockMedication}
        activeSubstances={mockActiveSubstances}
        isSelected={false}
        showSubstances={true}
      />
    )

    expect(screen.getByText(/Ibuprofen.*200mg/)).toBeInTheDocument()
  })

  it('does not show substances when showSubstances is false and not selected', () => {
    render(
      <MedicationRow
        medication={mockMedication}
        activeSubstances={mockActiveSubstances}
        isSelected={false}
        showSubstances={false}
      />
    )

    expect(screen.queryByText(/Ibuprofen/)).not.toBeInTheDocument()
  })

  it('shows substances when selected, regardless of showSubstances', () => {
    render(
      <MedicationRow
        medication={mockMedication}
        activeSubstances={mockActiveSubstances}
        isSelected={true}
        showSubstances={false}
      />
    )

    expect(screen.getByText(/Ibuprofen.*200mg/)).toBeInTheDocument()
  })
})
