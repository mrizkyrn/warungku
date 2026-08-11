# Warungku — pnpm + Turborepo + Vite/React + Express

## Structure

```
apps/
  api/        Express + TypeScript (NodeNext, tsx for dev, tsc for build)
  web/        Vite + React (esbuild dev server, vite build for prod)
packages/
  shared/     Types/constants shared between api and web, no build step
```

## What's global vs independent

**Global (root):** ESLint (eslint.config.js, per-app overrides via glob), Prettier,
tsconfig.base.json (shared compiler options), husky + lint-staged (pre-commit),
pnpm workspace definition.

**Independent (per-package):** runtime dependencies, module/moduleResolution
(api uses NodeNext, web uses Bundler via Vite), build tooling, test config,
env vars.

## Commands

```bash
pnpm install          # install everything
pnpm dev:api          # start Express on :3001
pnpm dev:web          # start Vite on :5173 (proxies /api -> :3001)
pnpm lint             # eslint across all packages (one root invocation, glob-scoped)
pnpm typecheck        # tsc --noEmit, recursively across all packages
pnpm build            # pnpm -r build (shared has no build step, api/web do)
pnpm format           # prettier --write .
```

No task runner (Turborepo/Nx) is used here — with just 2 apps + 1 shared
package, `pnpm -r` already handles dependency-aware script execution across
the workspace. Add Turborepo later if you start feeling build/lint get slow,
want caching, or grow past ~4-5 packages.

## Adding a new package

1. `mkdir packages/my-lib && cd packages/my-lib`
2. Copy `packages/shared/package.json` and `tsconfig.json` as a template,
   rename `@warungku/shared` -> `@warungku/my-lib`
3. Add it as a dependency where needed: `"@warungku/my-lib": "workspace:*"`
4. `pnpm install` to link it

## Notes

- `@warungku/shared` points `main`/`types` directly at `src/` — no build step needed
  since tsx and Vite both transpile TS on the fly. If you ever need `shared`
  consumed outside this monorepo (published to npm, used by another repo),
  give it a real `build` script (tsc emitting to `dist/`) and point
  `main`/`types` there instead.
- TS project `references` were deliberately left out — not needed since pnpm
  workspace linking already resolves `@warungku/shared` correctly, and adding
  references would require `composite: true` (which conflicts with `noEmit`
  in an app that has no declaration output).
