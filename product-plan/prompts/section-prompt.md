# Section Implementation Prompt

Use this template to implement one section at a time.

---

## For Foundation (First Session)

I need you to set up the foundation for **Meds**, a medication inventory app.

Please review:
- `product-overview.md` — What this app does
- `instructions/incremental/01-foundation.md` — Setup steps
- `design-system/` — Colors, fonts, tokens

Before starting, ask me about:
1. What framework to use (Next.js, Vite + React, etc.)?
2. Where will this be deployed?

---

## For Inventory Section

I need you to implement the **Inventory** section for Meds.

Please review the following files in `product-plan`:
- `product-overview.md` — Context about the app
- `instructions/incremental/02-inventory.md` — Implementation steps
- `sections/inventory/` — Components, types, sample data, tests

The foundation is already set up. This section needs:
- Medication list with search and sort
- Inline add/edit functionality
- Delete with undo toast
- Expired medication highlighting
- Empty state

---

## For Users Section

I need you to implement the **Users** section (authentication) for Meds.

Please review:
- `product-overview.md` — Context about the app
- `instructions/incremental/03-users.md` — Implementation steps
- `sections/users/` — Components, types, tests

Before starting, ask me about:
1. Which OAuth library to use?
2. What database/session storage?

This section needs:
- Login screen with Google/GitHub OAuth
- Email allow-list for access control
- User info display in shell
- Logout functionality
