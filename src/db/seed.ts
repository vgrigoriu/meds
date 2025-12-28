import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { DATABASE_PATH } from './config'
import { medications, activeSubstances, medicationSubstances } from './schema'

const sqlite = new Database(DATABASE_PATH)
const db = drizzle(sqlite)

async function seed() {
  console.log('Seeding database...')

  // Clear existing data
  db.delete(medicationSubstances).run()
  db.delete(medications).run()
  db.delete(activeSubstances).run()

  // Insert active substances
  const substances = [
    { id: 1, name: 'Ibuprofen' },
    { id: 2, name: 'Acetaminophen' },
    { id: 3, name: 'Pseudoephedrine' },
    { id: 4, name: 'Dextromethorphan' },
    { id: 5, name: 'Oxymetazoline' },
    { id: 6, name: 'Hydrocortisone' },
    { id: 7, name: 'Diphenhydramine' },
    { id: 8, name: 'Cetirizine' },
  ]

  for (const substance of substances) {
    db.insert(activeSubstances).values(substance).run()
  }
  console.log(`Inserted ${substances.length} active substances`)

  // Insert medications
  const meds = [
    { id: 1, name: 'Advil', presentation: 'pill' as const, expirationYear: 2025, expirationMonth: 8 },
    { id: 2, name: 'Tylenol Extra Strength', presentation: 'pill' as const, expirationYear: 2026, expirationMonth: 3 },
    { id: 3, name: 'NyQuil Cold & Flu', presentation: 'syrup' as const, expirationYear: 2024, expirationMonth: 11 },
    { id: 4, name: 'Sudafed', presentation: 'pill' as const, expirationYear: 2025, expirationMonth: 1 },
    { id: 5, name: 'Afrin Nasal Spray', presentation: 'spray' as const, expirationYear: 2024, expirationMonth: 6 },
    { id: 6, name: 'Cortisone 10', presentation: 'cream' as const, expirationYear: 2025, expirationMonth: 12 },
    { id: 7, name: 'Zyrtec', presentation: 'pill' as const, expirationYear: 2026, expirationMonth: 7 },
    { id: 8, name: 'Children\'s Motrin', presentation: 'syrup' as const, expirationYear: 2025, expirationMonth: 4 },
    { id: 9, name: 'Band-Aid Flexible Fabric', presentation: 'other' as const, expirationYear: 2027, expirationMonth: 9 },
    { id: 10, name: 'Visine Eye Drops', presentation: 'drops' as const, expirationYear: 2024, expirationMonth: 2 },
  ]

  for (const med of meds) {
    db.insert(medications).values(med).run()
  }
  console.log(`Inserted ${meds.length} medications`)

  // Insert medication-substance relationships
  const relations = [
    { medicationId: 1, substanceId: 1, concentration: '200mg' },  // Advil - Ibuprofen
    { medicationId: 2, substanceId: 2, concentration: '500mg' },  // Tylenol - Acetaminophen
    { medicationId: 3, substanceId: 2, concentration: '325mg' },  // NyQuil - Acetaminophen
    { medicationId: 3, substanceId: 4, concentration: '15mg' },   // NyQuil - Dextromethorphan
    { medicationId: 3, substanceId: 7, concentration: '6.25mg' }, // NyQuil - Diphenhydramine
    { medicationId: 4, substanceId: 3, concentration: '30mg' },   // Sudafed - Pseudoephedrine
    { medicationId: 5, substanceId: 5, concentration: '0.05%' },  // Afrin - Oxymetazoline
    { medicationId: 6, substanceId: 6, concentration: '1%' },     // Cortisone - Hydrocortisone
    { medicationId: 7, substanceId: 8, concentration: '10mg' },   // Zyrtec - Cetirizine
    { medicationId: 8, substanceId: 1, concentration: '100mg/5ml' }, // Children's Motrin - Ibuprofen
    // Band-Aid and Visine have no active substances
  ]

  for (const relation of relations) {
    db.insert(medicationSubstances).values(relation).run()
  }
  console.log(`Inserted ${relations.length} medication-substance relations`)

  console.log('Seeding complete!')
}

seed().catch(console.error)
