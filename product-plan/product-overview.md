# Meds — Product Overview

## Summary

A simple medication inventory app for households to track what medications they own and when they expire. Helps users see expiration dates at a glance, avoid duplicate purchases, and maintain a central list of everything in their medicine cabinet.

## Key Features

- Medication inventory list with presentation types and expiration dates
- Multi-user support with OAuth authentication (Google, GitHub)
- Shared household access for family members

## Planned Sections

1. **Inventory** — The core list of medications with names, presentation types, and expiration dates
2. **Users** — OAuth authentication and shared household access

## Data Model

**Entities:**
- **Medication** — An item in your inventory with a commercial name, presentation (pill, syrup, nasal spray, etc.), and expiration date
- **ActiveSubstance** — The actual drug compound (e.g., ibuprofen, acetaminophen). Multiple medications may contain the same active substance
- **User** — A person with an account who can view and manage the medication inventory

**Relationships:**
- Medication can contain many ActiveSubstances
- ActiveSubstance can be in many Medications
- User can manage all Medications (single shared inventory)

## Design System

**Colors:**
- Primary: `teal` — Used for buttons, links, key accents
- Secondary: `amber` — Used for expiration warnings, highlights
- Neutral: `slate` — Used for backgrounds, text, borders

**Typography:**
- Heading: Fraunces
- Body: Inter
- Mono: JetBrains Mono

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing, and application shell
2. **Inventory** — Core medication list with add, edit, delete, search, and sort
3. **Users** — OAuth login screen with Google and GitHub authentication

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
