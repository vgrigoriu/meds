# Typography

## Font Families

### Fraunces (Headings)
- **Source**: Google Fonts
- **Style**: Serif, old-style with soft optical features
- **Weights**: 400, 500, 600, 700
- **Use for**: Logo, page titles, section headers

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet">
```

### Inter (Body)
- **Source**: Google Fonts
- **Style**: Sans-serif, highly readable
- **Weights**: 400, 500, 600, 700
- **Use for**: Body text, labels, buttons, form inputs

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### JetBrains Mono (Monospace)
- **Source**: Google Fonts
- **Style**: Monospace, code-friendly
- **Weights**: 400, 500
- **Use for**: Code, technical data (if needed)

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Combined Import

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Tailwind CSS Setup

Add to your global CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.font-heading {
  font-family: 'Fraunces', Georgia, serif;
}

.font-body {
  font-family: 'Inter', system-ui, sans-serif;
}

.font-mono {
  font-family: 'JetBrains Mono', Menlo, monospace;
}
```

Or configure in Tailwind v4:

```css
@theme {
  --font-heading: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Menlo, monospace;
}
```

## Typography Scale

| Element | Font | Size | Weight | Class |
|---------|------|------|--------|-------|
| Logo | Fraunces | 24px (1.5rem) | 700 | `font-heading text-2xl font-bold` |
| Page Title | Fraunces | 30px (1.875rem) | 600 | `font-heading text-3xl font-semibold` |
| Section Title | Fraunces | 20px (1.25rem) | 600 | `font-heading text-xl font-semibold` |
| Body | Inter | 16px (1rem) | 400 | `font-body text-base` |
| Body Small | Inter | 14px (0.875rem) | 400 | `font-body text-sm` |
| Label | Inter | 14px (0.875rem) | 500 | `font-body text-sm font-medium` |
| Button | Inter | 14px (0.875rem) | 500 | `font-body text-sm font-medium` |
| Caption | Inter | 12px (0.75rem) | 400 | `font-body text-xs` |
