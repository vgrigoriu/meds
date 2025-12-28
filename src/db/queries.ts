import { db } from './index'
import { medications, activeSubstances, medicationSubstances } from './schema'
import { eq } from 'drizzle-orm'
import type { Medication, ActiveSubstance } from '@/types'

export async function getMedications(): Promise<Medication[]> {
  const meds = db.select().from(medications).all()
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
