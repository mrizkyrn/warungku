# Warugku — pnpm + Vite/React + Express

## Stack

- **pnpm** workspaces (`pnpm-workspace.yaml`), no Turborepo/Nx — `pnpm -r`
  runs scripts across the workspace
- **apps/api** — Express 5 + TypeScript (ESM/NodeNext), Prisma 7 + Postgres,
  Zod validation, pino logging, Vitest tests
- **apps/web** — Vite 8 + React 19, TanStack Router + Query, React Hook Form,
  Tailwind CSS v4, Base UI
- **packages/shared-types** — pure TypeScript types (no deps)
- **packages/shared-schemas** — Zod schemas + inferred types (depends on zod)

## Structure

```
apps/
  api/        Express + TypeScript (tsx for dev, tsup for build) — :3000
  web/        Vite + React (vite dev server, vite build) — :5173
packages/
  shared-types/     Types shared between api and web, no build step
  shared-schemas/   Zod schemas shared between api and web, no build step
docs/
  architecture.md   Package layout, data flow, dependency rules
  api.md            API module patterns, lifecycle, validation, errors
  web.md            Routing, features, data fetching, styling
  design.md         Design system: tokens, components, theme, forms
  shared-packages.md Shared types/schemas conventions
  development.md    Env setup, commands, database, testing
```

## What's global vs independent

**Global (root):** ESLint (`eslint.config.js`, per-app overrides via glob),
Prettier, `tsconfig.base.json` (shared compiler options), husky + lint-staged
(pre-commit), pnpm workspace definition.

**Independent (per-package):** runtime dependencies, `module`/`moduleResolution`
(api uses NodeNext, web uses Bundler), build tooling, test config, env vars.

## Install & run

```bash
pnpm install          # install everything

pnpm dev:api          # Express on :3000 (runs prisma generate + tsx watch)
pnpm dev:web          # Vite on :5173
pnpm dev              # both apps in parallel
```

> `.env` files are gitignored; there are no committed `.env.example` files —
> copy the values from `docs/development.md` → Environment setup before
> running the apps.

## Commands

```bash
pnpm lint             # eslint across all packages (one root invocation, glob-scoped)
pnpm typecheck        # tsc --noEmit, recursively across all packages
pnpm test             # vitest run — only the API has tests
pnpm build            # pnpm -r build (shared has no build step, api/web do)
pnpm format           # prettier --write .
pnpm format:check     # prettier --check .
```

## Adding a new package

1. `mkdir packages/my-lib && cd packages/my-lib`
2. Copy `packages/shared-types/package.json` and `tsconfig.json` as a template,
   rename `@repo/shared-types` → `@repo/my-lib`
3. Add it as a dependency where needed: `"@repo/my-lib": "workspace:*"`
4. `pnpm install` to link it

## Notes

- `@repo/shared-types` and `@repo/shared-schemas` point `main`/`types` directly
  at `src/` — no build step needed since tsx and Vite both transpile TS on the
  fly. If a shared package ever needs to be consumed outside this monorepo
  (published to npm), give it a real `build` script (tsc emitting to `dist/`)
  and point `main`/`types` there instead.
- TS project `references` were deliberately left out — pnpm workspace linking
  already resolves `@repo/*` correctly, and references would require
  `composite: true` (which conflicts with `noEmit`).

## Documentation

For agent-friendly, task-specific docs, see `AGENTS.md` (routing) and the files
under `docs/`.