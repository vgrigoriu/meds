# Meds — Export Package

A complete design and implementation package for **Meds**, a medication inventory tracking app.

## Quick Start

### Option 1: One-Shot Implementation
1. Open `prompts/one-shot-prompt.md`
2. Copy the prompt to your coding assistant (Claude, Cursor, etc.)
3. Provide `product-overview.md` and `instructions/one-shot-instructions.md`
4. Follow the assistant's questions about tech stack

### Option 2: Incremental Implementation
1. Open `prompts/section-prompt.md`
2. Start with the Foundation section
3. Implement Inventory, then Users
4. Each section has its own instruction file in `instructions/incremental/`

## Package Contents

```
product-plan/
├── README.md                    # This file
├── product-overview.md          # Product description and features
│
├── prompts/                     # Ready-to-use prompts
│   ├── one-shot-prompt.md       # Full implementation prompt
│   └── section-prompt.md        # Section-by-section templates
│
├── instructions/                # Implementation guides
│   ├── one-shot-instructions.md # All milestones combined
│   └── incremental/             # Per-milestone instructions
│       ├── 01-foundation.md
│       ├── 02-inventory.md
│       └── 03-users.md
│
├── design-system/               # Visual design tokens
│   ├── colors.json              # Color palette
│   ├── typography.json          # Font choices
│   ├── tokens.css               # CSS custom properties
│   ├── tailwind-colors.md       # Color usage guide
│   └── fonts.md                 # Typography guide
│
├── data-model/                  # Data structure
│   └── data-model.md            # Entity descriptions
│
├── shell/                       # Application shell
│   ├── README.md                # Shell documentation
│   └── components/              # Header, search, user menu
│
└── sections/
    ├── inventory/               # Main section
    │   ├── README.md            # Section documentation
    │   ├── tests.md             # Test specifications
    │   ├── types.ts             # TypeScript interfaces
    │   ├── data.json            # Sample data
    │   └── components/          # UI components
    │
    └── users/                   # Authentication section
        ├── README.md            # Section documentation
        ├── tests.md             # Test specifications
        ├── types.ts             # TypeScript interfaces
        ├── data.json            # Sample data
        └── components/          # Login screen
```

## Product Summary

**Meds** helps you track medications in your household:
- What you have
- When they expire

### Key Features
- **Inventory list** with search and sort
- **Inline CRUD** with undo for deletions
- **Expired highlighting** in amber
- **OAuth login** (Google + GitHub, invite-only)
- **Mobile responsive** with dark mode

### Design System
- **Colors**: Teal (primary), Amber (secondary), Slate (neutral)
- **Fonts**: Fraunces (headings), Inter (body)
- **Framework**: Tailwind CSS

## Implementation Milestones

| # | Milestone | Description |
|---|-----------|-------------|
| 1 | Foundation | Project setup, Tailwind, fonts, base layout |
| 2 | Inventory | Medication list with full CRUD |
| 3 | Users | OAuth authentication |

## Tech Stack Recommendations

The components are framework-agnostic React. Recommended stacks:

### Simple
- Vite + React
- SQLite (better-sqlite3)
- Lucia Auth

### Full-Featured
- Next.js (App Router)
- PostgreSQL (Prisma)
- NextAuth.js

### Serverless
- Next.js
- PlanetScale or Supabase
- Clerk or Auth.js

## Need Help?

Each section includes:
- `README.md` — Component overview and usage
- `tests.md` — Test specifications (TDD-friendly)
- `types.ts` — TypeScript interfaces
- `data.json` — Sample data for development

Start with the prompts in `prompts/` — they're designed to guide a coding assistant through implementation.
