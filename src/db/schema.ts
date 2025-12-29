import { sqliteTable, text, integer, primaryKey, check } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const medications = sqliteTable(
  'medications',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    presentation: text('presentation', {
      enum: ['pill', 'syrup', 'spray', 'cream', 'drops', 'other'],
    }).notNull(),
    expirationYear: integer('expiration_year').notNull(),
    expirationMonth: integer('expiration_month').notNull(),
    deleted: integer('deleted', { mode: 'boolean' }),
  },
  (table) => [
    check('valid_year', sql`${table.expirationYear} >= 2000 AND ${table.expirationYear} <= 2100`),
    check('valid_month', sql`${table.expirationMonth} >= 1 AND ${table.expirationMonth} <= 12`),
    check('valid_presentation', sql`${table.presentation} IN ('pill', 'syrup', 'spray', 'cream', 'drops', 'other')`),
  ]
)

export const activeSubstances = sqliteTable('active_substances', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
})

export const medicationSubstances = sqliteTable(
  'medication_substances',
  {
    medicationId: integer('medication_id')
      .notNull()
      .references(() => medications.id, { onDelete: 'restrict' }),
    substanceId: integer('substance_id')
      .notNull()
      .references(() => activeSubstances.id, { onDelete: 'restrict' }),
    concentration: text('concentration'), // Optional, e.g., "500mg", "10ml"
  },
  (table) => [
    primaryKey({ columns: [table.medicationId, table.substanceId] }),
  ]
)
