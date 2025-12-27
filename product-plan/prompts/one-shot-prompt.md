# One-Shot Implementation Prompt

Copy this prompt to implement the entire Meds application in one session.

---

I need you to implement **Meds**, a medication inventory tracking app. I have a complete design package with components, types, and implementation instructions.

## Before We Start

Please ask me about:
1. **Tech stack**: What framework should we use? (Next.js, Vite + React, Remix, etc.)
2. **Authentication**: Which OAuth library? (NextAuth, Lucia, Clerk, etc.)
3. **Database**: Where should we store data? (PostgreSQL, SQLite, MongoDB, etc.)
4. **Deployment**: Where will this be hosted? (Vercel, Railway, self-hosted, etc.)

## What I'm Providing

1. **Product Overview** — What this app does and why
2. **Implementation Instructions** — Step-by-step guide covering all milestones
3. **Design System** — Colors (teal/amber/slate), fonts (Fraunces/Inter)
4. **Data Model** — Medication, ActiveSubstance, User entities
5. **React Components** — Ready-to-integrate shell and section components
6. **Test Specs** — TDD-style test descriptions for each section

## Implementation Order

1. **Foundation** — Project setup, Tailwind, fonts, base layout
2. **Inventory** — Main medication list with CRUD operations
3. **Users** — OAuth authentication with Google/GitHub

## Key Requirements

- OAuth with Google and GitHub (invite-only via email allow-list)
- Single shared inventory for all users
- Mobile-responsive with dark mode support
- Inline add/edit/delete with undo for deletions
- Expired medications highlighted in amber

Please review `product-overview.md` first, then let's discuss the technical choices before starting implementation.
