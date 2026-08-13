# Shared Packages — packages/

Two packages hold everything shared between `api` and `web`. Both are consumed
as source (no build step): `main`/`types`/`exports` point at `./src/index.ts`,
linked via `"@repo/*": "workspace:*"`.

## Layout

```
packages/
  shared-types/     Pure TypeScript types only (zero runtime deps)
    src/index.ts            export type * from './<name>.js'; etc.
    src/<name>.ts           Per-domain interfaces
  shared-schemas/   Zod schemas + inferred types (only dep: zod)
    src/index.ts            export * from './<name>.schema.js';
    src/<name>.schema.ts    Field primitives, create/update bodies, inferred types
```

## Conventions

- **`shared-types` exports only types** with `export type *`. No runtime values,
  no dependencies.
- **`shared-schemas` exports values** (Zod schemas) via plain `export *`, plus
  inferred input types (`export type CreateInput = z.infer<...>`).
- Both use `.js` extensions on internal re-exports (`export * from './<name>.schema.js'`)
  and relative imports, matching the NodeNext ESM convention in `api`.
- **Schema layering** in `shared-schemas`:
  1. Field primitives, e.g. an id schema `z.cuid2('Invalid id')` and an email
     schema `z.email('Invalid email address')`.
  2. Create body: full shape, e.g. `z.object({ email, name })`.
  3. Update body: all fields `.optional()` + `.refine((d) => Object.keys(d).length > 0)`
     so an empty body is rejected.
  4. Only domain/body shapes belong here — request *envelopes*
     (`{ params, query, body }`), pagination query parsing, and path-param
     schemas are per-module concerns in `apps/api/src/modules/<feature>/*.schema.ts`.
- **Dependency rule**: `packages/*` may be imported by `apps/*`, never the
  reverse; `shared-types` stays dependency-free and `shared-schemas` depends
  only on `zod`. See `docs/architecture.md` → Dependency rules.

## Adding a new shared schema / type

1. Add the field primitives + create/update bodies to a new
   `packages/shared-schemas/src/<name>.schema.ts`.
2. Re-export from `packages/shared-schemas/src/index.ts` with a `.js` suffix:
   `export * from './<name>.schema.js';`
3. Add the matching interface to `packages/shared-types/src/<name>.ts` and
   re-export via `export type *` in `packages/shared-types/src/index.ts`.
4. Wire it into the API module (`apps/api/src/modules/<feature>/feature.schema.ts`
   wraps the body schemas) and the web feature (`api.ts`/`queries.ts` import the
   types and inferred inputs) — see `docs/api.md` and `docs/web.md`.
5. Verify: `pnpm --filter @repo/shared-schemas typecheck`,
   `pnpm --filter @repo/shared-types typecheck`, `pnpm lint`.

Follow the conventions above when adding new schemas or types. Existing files
may contain domain-specific differences and should not be treated as templates.
