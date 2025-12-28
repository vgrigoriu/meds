import { db } from './index'
import { medications, activeSubstances, medicationSubstances } from './schema'
import { eq, isNull, or } from 'drizzle-orm'
import type { Medication, ActiveSubstance, Presentation } from '@/types'

export async function getMedications(): Promise<Medication[]> {
  const meds = db.select().from(medications).where(
    or(isNull(medications.deleted), eq(medications.deleted, false))
  ).all()
  const relations = db.select().from(medicationSubstances).all()

  return meds.map((med) => ({
    id: med.id,
    name: med.name,
    presentation: med.presentation,
    expirationYear: med.expirationYear,
    expirationMonth: med.expirationMonth,
    substances: relations
      .filter((r) => r.medicationId === med.id)
      .map((r) => ({
        substanceId: r.substanceId,
        concentration: r.concentration,
      })),
  }))
}

export async function getActiveSubstances(): Promise<ActiveSubstance[]> {
  return db.select().from(activeSubstances).all()
}

export interface CreateMedicationInput {
  name: string
  presentation: Presentation
  expirationYear: number
  expirationMonth: number
  substances: { name: string; concentration: string | null }[]
}

export async function createMedication(input: CreateMedicationInput): Promise<Medication> {
  const { name, presentation, expirationYear, expirationMonth, substances } = input

  // Use a transaction to ensure atomicity
  const result = db.transaction((tx) => {
    // Create the medication
    const med = tx
      .insert(medications)
      .values({ name, presentation, expirationYear, expirationMonth })
      .returning()
      .get()

    const substanceLinks: { substanceId: number; concentration: string | null }[] = []

    // Process each substance
    for (const sub of substances) {
      // Find or create the substance
      let substance = tx
        .select()
        .from(activeSubstances)
        .where(eq(activeSubstances.name, sub.name))
        .get()

      if (!substance) {
        substance = tx
          .insert(activeSubstances)
          .values({ name: sub.name })
          .returning()
          .get()
      }

      // Link substance to medication
      tx.insert(medicationSubstances)
        .values({
          medicationId: med.id,
          substanceId: substance.id,
          concentration: sub.concentration,
        })
        .run()

      substanceLinks.push({
        substanceId: substance.id,
        concentration: sub.concentration,
      })
    }

    return {
      id: med.id,
      name: med.name,
      presentation: med.presentation as Presentation,
      expirationYear: med.expirationYear,
      expirationMonth: med.expirationMonth,
      substances: substanceLinks,
    }
  })

  return result
}
