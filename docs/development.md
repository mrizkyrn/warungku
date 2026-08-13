# Development

## Prerequisites

- Node.js ≥ 20
- pnpm (use the version specified by `package.json`)
- Postgres (local instance for the API)

## Environment setup

Copy the example files and update the values as needed:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## Install

```bash
pnpm install
```

## Database (API)

- Migrations are applied with Prisma. The client is generated on `dev`/`build`.
- `DATABASE_URL` must point at a running Postgres.

```bash
pnpm --filter api db:migrate     # apply migrations (prisma migrate dev)
pnpm --filter api db:push        # sync schema without migrations
pnpm --filter api db:studio      # Prisma Studio
pnpm --filter api db:generate    # regenerate the client
pnpm --filter api db:reset       # drop + reapply migrations
pnpm --filter api db:seed        # seed the database
```

## Run

```bash
pnpm dev:api     # Express on :3000 (prisma generate + tsx watch)
pnpm dev:web     # Vite on :5173
pnpm dev         # both apps in parallel
```

## Verify changes (the commands that exist)

```bash
pnpm lint              # eslint (root, glob-scoped across packages)
pnpm lint:fix
pnpm typecheck         # tsc --noEmit recursively across packages
pnpm test              # vitest run — only the API has tests
pnpm format            # prettier --write .
pnpm format:check      # prettier --check .
pnpm build             # pnpm -r build (api: tsup; web: tsc --noEmit && vite build)
```

Targeting a single package:

```bash
pnpm --filter api lint
pnpm --filter api test
pnpm --filter api typecheck
pnpm --filter web typecheck
```

## Test structure

- Only `apps/api` has tests (Vitest). No tests exist in `web` or the packages.
- Run with `pnpm --filter api test` (or `test:watch`, `test:coverage`).
- Patterns (supertest route tests, mocked service/repository): `docs/api.md` → Testing.

## Git hooks

- `husky` runs `lint-staged` on pre-commit: ESLint `--fix` on
  `*.{ts,tsx,js,jsx}` and Prettier `--write` on `*.{ts,tsx,js,jsx,json,md,yml,yaml}`.
- Existing commits use conventional style, e.g. `feat(api): add <feature> module`,
  `feat(web): add <feature> page`, `refactor(config): …`.

## Clean

- `pnpm clean` removes `dist` and `node_modules` recursively — it uses `rm -rf`