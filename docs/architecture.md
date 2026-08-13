# Architecture

A pnpm workspace monorepo consisting of one Express API, one Vite/React web
app, and two shared packages. There is no task runner; `pnpm -r` handles
dependency-aware script execution.

## Package layout

```
apps/
  api/     Express 5 + TypeScript REST API
  web/     Vite 8 + React 19 SPA
packages/
  shared-types/     Pure TypeScript types (no deps), no build step
  shared-schemas/   Zod schemas + inferred types (depends on zod), no build step
```

- Workspace defined in `pnpm-workspace.yaml` (`apps/*`, `packages/*`).
- Shared packages are linked via `"@repo/*": "workspace:*"` and consumed as
  source (`main`/`types`/`exports` → `./src/index.ts`); tsx and Vite transpile
  them on the fly, so there is no build step.

## Data flow

```
web (React Query) ──HTTP /api/v1──▶ api (Express) ──Prisma──▶ Postgres
        ▲                              │
        └── types + Zod schemas ───────┘   @repo/shared-types
                                           @repo/shared-schemas
```

- The browser never talks to Postgres directly; everything goes through the API.
- Both apps import validation schemas and response/domain types from the shared
  packages, so request/response shapes stay in sync (create/update inputs are
  inferred from the shared Zod schemas and used on both sides).
- Prisma client is generated into `apps/api/generated/prisma` (gitignored) by
  `prisma generate`; the schema lives in `apps/api/prisma/schema.prisma`.

## Dependency rules

- `apps/*` may depend on `packages/*`, never the reverse.
- `apps/web` must not import from `apps/api`, and `apps/api` must not import
  from `apps/web`.
- `packages/shared-schemas` depends on `zod`; `packages/shared-types` has no
  runtime dependencies.
- Shared packages must remain framework-agnostic and usable from both the
  Node API and browser application.

## Important Boundaries

- Keep business logic inside the application that owns it.
- Do not move application-specific code into shared packages just to avoid duplication.
- Preserve the dependency direction between apps and packages.
- When adding a feature, follow the existing structure of the application that owns it rather than introducing a new architectural pattern.