# Users Tests

Test specifications for the Users section (authentication). These are framework-agnostic and describe expected behaviors.

## Login Screen Display Tests

- [ ] Shows "Meds" logo/title
- [ ] Shows "Track your medications" subtitle
- [ ] Displays Google OAuth button with Google icon
- [ ] Displays GitHub OAuth button with GitHub icon
- [ ] Shows "Access is restricted to authorized users only" footer text
- [ ] Has decorative background elements

## OAuth Button Tests

- [ ] Clicking Google button calls onLogin with 'google'
- [ ] Clicking GitHub button calls onLogin with 'github'
- [ ] Buttons are disabled when isLoading is true
- [ ] Buttons have proper hover states

## Loading State Tests

- [ ] Shows spinner when isLoading is true
- [ ] Hides OAuth buttons when loading
- [ ] Spinner uses teal accent color

## Error State Tests

- [ ] Displays error message when error prop is provided
- [ ] Error message appears above OAuth buttons
- [ ] Error has red background and border
- [ ] Error message is readable in both light and dark modes

## Authentication Flow Tests

### Allowed User
- [ ] User clicks OAuth button
- [ ] onLogin callback is called with provider
- [ ] (Integration) OAuth redirect completes
- [ ] (Integration) Email is on allow-list
- [ ] (Integration) User is redirected to Inventory

### Denied User
- [ ] User clicks OAuth button
- [ ] onLogin callback is called with provider
- [ ] (Integration) OAuth redirect completes
- [ ] (Integration) Email is NOT on allow-list
- [ ] (Integration) Error message is displayed
- [ ] (Integration) User remains on login screen

## Dark Mode Tests

- [ ] Background switches to dark slate
- [ ] Card has dark background
- [ ] Text is readable (light on dark)
- [ ] Google button inverts colors appropriately
- [ ] GitHub button inverts colors appropriately
- [ ] Error state is visible in dark mode

## Responsive Tests

- [ ] Login card is centered on all screen sizes
- [ ] Card has max-width to prevent stretching on large screens
- [ ] Buttons are full-width within card
- [ ] Works on mobile (320px width)

## Accessibility Tests

- [ ] OAuth buttons are keyboard accessible
- [ ] Focus is visible on buttons
- [ ] Screen reader announces button labels
- [ ] Error message is announced by screen reader
- [ ] Loading state is announced
