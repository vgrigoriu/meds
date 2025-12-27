# Application Shell

A minimal header shell for Meds providing quick access to search and user controls.

## Components

| Component | Description |
|-----------|-------------|
| `AppShell` | Main layout wrapper with header and content area |
| `Header` | Top bar with logo, search, and user menu |
| `SearchBar` | Input for filtering medications |
| `UserMenu` | Dropdown with user info and logout |

## Layout

```
Desktop/Tablet:
┌──────────────────────────────────────────────────┐
│  Meds    [        Search...        ]    [Avatar] │
├──────────────────────────────────────────────────┤
│                                                  │
│                   Content                        │
│                                                  │
└──────────────────────────────────────────────────┘

Mobile:
┌──────────────────────────────────────────────────┐
│  Meds                                   [Avatar] │
│  [              Search...                      ] │
├──────────────────────────────────────────────────┤
│                                                  │
│                   Content                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Key Features

- **Minimal header**: Logo + Search + User avatar
- **User menu**: Dropdown with name and logout button
- **Responsive**: Search moves below header on mobile
- **Dark mode**: Full support for light/dark themes

## Usage

```tsx
import { AppShell, Header, SearchBar, UserMenu } from './components'

<AppShell>
  <Header>
    <SearchBar
      value={searchQuery}
      onChange={(query) => {}}
      placeholder="Search medications..."
    />
    <UserMenu
      name="John Doe"
      avatarUrl="/avatar.jpg"
      onLogout={() => {}}
    />
  </Header>
  <main>
    {/* Inventory content */}
  </main>
</AppShell>
```

## Design Notes

- Logo uses Fraunces font (heading font from design system)
- Search bar is always visible (never collapsed)
- User avatar shows dropdown on click with logout option
- No navigation menu needed (single-section app)
