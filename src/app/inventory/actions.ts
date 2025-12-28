'use server'

import { revalidatePath } from 'next/cache'
import { createMedication, type CreateMedicationInput } from '@/db/queries'
import type { Presentation } from '@/types'

const VALID_PRESENTATIONS: Presentation[] = ['pill', 'syrup', 'spray', 'cream', 'drops', 'other']

interface AddMedicationResult {
  success: boolean
  error?: string
  medicationId?: number
}

export async function addMedication(input: CreateMedicationInput): Promise<AddMedicationResult> {
  // Validate input
  if (!input.name?.trim()) {
    return { success: false, error: 'Numele este obligatoriu' }
  }

  if (!VALID_PRESENTATIONS.includes(input.presentation)) {
    return { success: false, error: 'Forma este invalidă' }
  }

  if (input.expirationYear < 2000 || input.expirationYear > 2100) {
    return { success: false, error: 'Anul trebuie să fie între 2000 și 2100' }
  }

  if (input.expirationMonth < 1 || input.expirationMonth > 12) {
    return { success: false, error: 'Luna trebuie să fie între 1 și 12' }
  }

  try {
    const medication = await createMedication({
      name: input.name.trim(),
      presentation: input.presentation,
      expirationYear: input.expirationYear,
      expirationMonth: input.expirationMonth,
      substances: input.substances.map((s) => ({
        name: s.name.trim(),
        concentration: s.concentration?.trim() || null,
      })),
    })

    revalidatePath('/inventory')
    return { success: true, medicationId: medication.id }
  } catch (error) {
    console.error('Failed to create medication:', error)
    return { success: false, error: 'A apărut o eroare la salvare' }
  }
}
