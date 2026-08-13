# Design — apps/web

Goal: clean, minimalist, consistent UI. Prefer the token system and the
existing `components/ui/` primitives over ad-hoc classes, colors, and bespoke
components.

## Semantic tokens

Colors come from CSS variables in `src/global.css`, mapped by `@theme inline`
to Tailwind utilities. Use these — **never raw color classes** such as
`text-gray-900`, `bg-white`, `text-blue-600` (they break dark mode).

Common tokens:

| Purpose          | Use                                                        |
| ---------------- | ---------------------------------------------------------- |
| Page background  | `bg-background`, `text-foreground`                          |
| Surfaces         | `bg-card` + `text-card-foreground`, `bg-muted`, `bg-popover` |
| Accent / primary | `bg-primary` + `text-primary-foreground`                    |
| Secondary text   | `text-muted-foreground`                                     |
| Destructive      | `text-destructive`, `bg-destructive/10`                     |
| Borders / focus  | `border-border`, `border-input`, `border-ring`, `ring-ring` |

## UI components

- Use the primitives in `components/ui/` (`Button`, `Input`, `Label`, `Card`,
  `Alert`, …). for common UI elements. Create feature-specific components
inside `features/<feature>/` when needed.
- Add new reusable UI primitives with shadcn scaffolding
(`components.json` is configured; Base UI, `base-nova` style) so they match the existing set.
- Variants are defined with `cva` and merged with `cn()` from `@/lib/utils` —
  see `components/ui/button.tsx`.
- Where feature vs generic components live: `docs/web.md` → Folder roles.

## Theme

- Dark mode toggles the `.dark` class on `<html>` via `lib/theme.ts`
  (`light`/`dark`/`system`, persisted in localStorage). The initial class is
  applied inline in `index.html` to avoid a flash.
- Semantic tokens are the only theme-aware colors — using them means a
  component works in both themes without extra work.
- Verify new UI in both light and dark mode.

## Layout

- Keep a consistent content column: centered with `mx-auto`, horizontal
  padding, vertical padding (see the root layout in `routes/__root.tsx`).
- Use Tailwind spacing utilities for rhythm (`flex flex-col gap-*`,
  `space-y-*`, `mt-*`); don't invent custom spacing.

## Typography

- Keep the scale minimal and consistent:
  - Page title: `text-2xl font-semibold text-foreground`
  - Section heading: `text-lg font-medium text-foreground`
  - Body / secondary: `text-sm text-muted-foreground`
- Text color is always a semantic token (`text-foreground`,
  `text-muted-foreground`, `text-destructive`) — never a raw gray.

## Forms

- Use React Hook Form + `zodResolver` with schemas from `@repo/shared-schemas`
  (see `features/<feature>/<feature>-form.tsx` and the feature template).
- Compose `Label` + `Input` per field; show field errors inline with
  `text-destructive text-sm` next to the input.
- Show submit/server errors with `<Alert variant="destructive">`.
- Disable the submit button while submitting (`isSubmitting`).

## Minimalist rules of thumb

- Keep clear action hierarchy. Use Button variants consistently:
`default` for primary actions, `outline`/`secondary` for secondary actions,
and `destructive` for destructive actions.
- Prefer whitespace and layout over decorative borders, shadows, and colors.
- Don't restyle primitives inline — extend via the variant system or
  `components/ui/`.
