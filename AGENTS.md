# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

pnpm workspace monorepo containing:
- Express REST API (`apps/api`)
- Vite + React SPA (`apps/web`)
- Shared packages (`packages/`)
- PostgreSQL database managed with Prisma

## High-level architecture

- `web` communicates with `api` over HTTP (`/api/v1`).
- Shared types and schemas live in `packages/`.
- `apps/*` may depend on `packages/*`; packages must not depend on apps.
- Shared packages should remain framework-agnostic.

See `docs/architecture.md` for details.

## Repository structure

```
apps/api/       Backend API
apps/web/       Frontend SPA
packages/       Shared types and schemas
docs/           Project documentation
```

## Conventions (project-wide)

- Use strict TypeScript and ESM.
- Use .js extensions for relative imports.
- Use the @/ alias for src/ imports.
- Put shared API types and schemas in packages/.
- Follow existing patterns before introducing new abstractions or dependencies.
- Keep changes focused and avoid unrelated refactoring.
- Run lint and typecheck after code changes.

## Which docs to read

- Backend/API task → `docs/api.md` (module pattern, lifecycle, validation, errors, adding a module)
- Frontend/Web task → `docs/web.md` (routes, feature pattern, data fetching, styling, adding a feature)
- Web design/UI task → `docs/design.md` (semantic tokens, components, theme, layout, typography, forms)
- Shared types/schemas → `docs/shared-packages.md` (schema layering, conventions, adding a schema/type)
- Architecture / dependency question → `docs/architecture.md`
- Environment setup, commands, database, testing → `docs/development.md`
- Human-oriented overview → `README.md`

## Verification

Run relevant checks after changes:

```bash
pnpm lint
pnpm typecheck
pnpm test
```