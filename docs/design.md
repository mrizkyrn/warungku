# Design — apps/web

Goal: clean, minimalist, consistent UI. Prefer the token system and existing
`components/ui/` primitives over ad-hoc classes, colors, and bespoke components.

## Mobile-first

Design every screen for mobile first, then progressively enhance it for larger
viewports.

- Base Tailwind classes define the mobile experience.
- Use `sm:`, `md:`, and `lg:` only when the UI needs to adapt to more space.
- Mobile-first applies to **layout, sizing, spacing, typography, and component
  behavior**, not just positioning.
- Stack content, forms, and actions vertically by default when appropriate.
- Components may become horizontal, wider, or multi-column at larger breakpoints.
- Keep buttons and interactive controls usable on touch screens. For example,
  use `w-full sm:w-auto` when a full-width mobile action is appropriate.
- Avoid horizontal scrolling and fixed widths that can overflow on mobile.
- Verify the mobile layout first, then check larger breakpoints.
- Do not make every property responsive by default; add responsive styles only
  when they improve usability.

## Semantic tokens

Colors come from CSS variables in `src/global.css`, mapped by `@theme inline`
to Tailwind utilities. Use these — **never raw color classes** such as
`text-gray-900`, `bg-white`, `text-blue-600` (they break dark mode).

Common tokens:

| Purpose | Use |
| --- | --- |
| Page background | `bg-background`, `text-foreground` |
| Surfaces | `bg-card` + `text-card-foreground`, `bg-muted`, `bg-popover` |
| Accent / primary | `bg-primary` + `text-primary-foreground` |
| Secondary text | `text-muted-foreground` |
| Destructive | `text-destructive`, `bg-destructive/10` |
| Borders / focus | `border-border`, `border-input`, `border-ring`, `ring-ring` |

## UI components

- Use primitives in `components/ui/` (`Button`, `Input`, `Label`, `Card`,
  `Alert`, …) for common UI elements.
- Create feature-specific components inside
  `features/<feature>/components/`.
- Add new reusable primitives with shadcn scaffolding
  (`components.json` is configured; Base UI, `base-nova` style).
- Define variants with `cva` and merge classes with `cn()` from `@/lib/utils`.
- See `docs/web.md` for feature vs generic component placement.

## Theme

- Dark mode toggles the `.dark` class on `<html>` via `lib/theme.ts`
  (`light`/`dark`/`system`, persisted in localStorage).
- Semantic tokens are the only theme-aware colors.
- Verify new UI in both light and dark mode.

## Layout

- Start with a simple, single-column mobile layout.
- Progressively introduce wider layouts, grids, and horizontal arrangements
  when larger screens provide enough space.
- Keep a consistent content column using `mx-auto`, horizontal padding, and
  vertical padding.
- Use Tailwind spacing utilities for rhythm (`gap-*`, `space-y-*`, `mt-*`).
- Prefer flexible sizing over fixed widths.
- Keep touch targets comfortable on small screens.

## Typography

- Keep the scale minimal and consistent:
  - Page title: `text-2xl font-semibold text-foreground`
  - Section heading: `text-lg font-medium text-foreground`
  - Body / secondary: `text-sm text-muted-foreground`
- Text colors must use semantic tokens, never raw colors.

## Forms

- Use React Hook Form + `zodResolver` with schemas from
  `@repo/shared-schemas`.
- Stack fields vertically on mobile; use multiple columns only when useful on
  larger screens.
- Compose `Label` + `Input` per field.
- Show field errors inline with `text-destructive text-sm`.
- Show submit/server errors with `<Alert variant="destructive">`.
- Disable submit while submitting (`isSubmitting`).
- Keep primary actions easy to reach and comfortable on touch screens.

## Minimalist rules of thumb

- Keep clear action hierarchy:
  `default` for primary, `outline`/`secondary` for secondary, and
  `destructive` for destructive actions.
- Prefer whitespace and layout over decorative borders, shadows, and colors.
- Start simple on mobile; add complexity only when space justifies it.
- Don't restyle primitives inline. Extend the variant system or
  `components/ui/` when customization is needed.