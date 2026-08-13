# Backend — apps/api

Express 5 REST API in TypeScript (ESM, NodeNext). Port `3000`. Mounted under
`/api/v1`. Uses Prisma 7 (Postgres), Zod for validation, pino for logging.

## Structure

```
src/
  server.ts                     Entry — boot, graceful shutdown, process handlers
  app.ts                        Express app assembly (middleware + routers)
  config/                       App-level config (env parsing)
  errors/                       AppError hierarchy for HTTP error responses
  lib/                          Cross-cutting infrastructure (db, logger, api-response)
  middleware/                   Express middleware (validation, error, logging)
  modules/<feature>/            One folder per feature (see below)
  routes/index.ts               Mounts module routers under /api/v1
  types/                        Global type augmentation (e.g. Express.Request)
```

## Folder roles — where to put what

| Folder | Purpose | Used for |
| --- | --- | --- |
| `config/` | Application startup configuration. | Environment parsing and derived configuration. Not for feature logic. |
| `errors/` | Application error hierarchy. | `AppError` and typed HTTP errors such as `NotFoundError` and `ConflictError`. |
| `lib/` | Shared application infrastructure. | Prisma client, logger, response helpers, and other cross-cutting infrastructure. |
| `middleware/` | Express middleware, one file per concern. | Validation, error handling, request logging, etc. |
| `modules/` | Feature-specific backend code. | One folder per feature. See "Module organization". |
| `routes/` | Top-level route wiring. | Mounting module routers under `/api/v1`; do not add endpoint logic here. |
| `types/` | Global TypeScript declarations. | Ambient type augmentation such as `Express.Request`. |

Rule of thumb: **feature-specific backend code → `modules/<feature>/`**.

Keep `config/`, `errors/`, `lib/`, `middleware/`, `routes/`, and `types/` for
cross-cutting concerns and infrastructure, not feature logic.

## Module organization

Each feature is a self-contained folder with a layered structure:

| File | Responsibility |
| --- | --- |
| `*.schema.ts` | Zod request schemas using `body` / `query` / `params` envelopes. |
| `*.routes.ts` | Router wiring: `validate(schema)` → controller handler. |
| `*.controller.ts` | Reads `req.validated`, calls the service, and responds through `ApiResponse`. |
| `*.service.ts` | Business logic and application rules. Throws `AppError` subclasses and has no Express/HTTP concerns. |
| `*.repository.ts` | Prisma data access only. |
| `*.test.ts` | Vitest tests, including service and Supertest route tests. |

Keep the layer boundaries clear:

- Controllers handle HTTP concerns, not business logic.
- Services handle business logic, not Express concerns.
- Repositories handle database access, not business logic.

## Request lifecycle

1. The route applies `validate(schema)` (Zod) to the controller handler.
2. `validate.middleware.ts` runs `schema.safeParse({ body, query, params })`
   and puts the result on `req.validated`.
3. Controller reads `req.validated.body/query/params`, calls the service.
4. Service enforces business rules, throwing `NotFoundError`/`ConflictError`/etc.
5. Repository executes Prisma queries.
6. Controller replies through `ApiResponse` (`success`, `created`, `noContent`).
7. Errors fall through to the global `errorHandler`.

## Validation

- Request-level schemas live in `modules/<feature>/*.schema.ts` and wrap the
  shared domain schemas from `@repo/shared-schemas` (e.g. `<feature>BodySchema`)
  in a request envelope:
  ```ts
  export const createFeatureSchema = z.object({ body: createFeatureBodySchema });
  ```
- Domain schemas (fields, create/update bodies) live in
  `packages/shared-schemas` and are reused by the frontend.
  See `docs/shared-packages.md` for the shared-package conventions.
- Query-string values are coerced, e.g. `z.coerce.number().int().min(1).default(1)`.
- Path params are typed with an id schema (`z.cuid2`).

## Error handling

- `errors/app-error.ts` exports `AppError` and `BadRequestError`, `UnauthorizedError`,
  `ForbiddenError`, `NotFoundError`, `ConflictError`, `InternalServerError`.
- Services throw these errors; controllers do not construct error responses.
- `errorHandler` (middleware) maps to responses:
  - `ZodError` → 400 with field errors (`errors` object)
  - malformed JSON → 400
  - Prisma `P2002` (unique violation) → 409
  - `AppError` → its `statusCode`
  - anything else → 500 (logged)

## API conventions

- Base path: `/api/v1`. Health check: `GET /api/v1/health`.
- Every response uses the envelope from `@repo/shared-types`
  (`ApiSuccessResponse` / `ApiErrorResponse`). Use `ApiResponse` helpers — never
  `res.json()` directly.
- Pagination: offset-based (`page`/`limit`, `page`-1-based, `limit` ≤ 100) with
  `meta: { page, limit, total, totalPages }`; list endpoints use
  `ApiResponse.success(res, { data, meta })`.
- 201 on create, 204 (no body) on delete.

## Database access

- Schema: `prisma/schema.prisma` (Postgres). Migrations in `prisma/migrations`.
- Prisma client generated to `apps/api/generated/prisma`; imported from
  `src/lib/db.ts` (singleton, `pg` adapter, query logging). Repositories import
  `prisma` and the Prisma types from `@/lib/db.js`.

## Adding a new module

A ready-to-copy template lives in `apps/api/templates/feature/`. Copy it to
`src/modules/<feature>/`, rename `feature` → `<feature>` everywhere (file names,
imports, and the `featureService`/`featureRouter`/etc. symbols), then edit.

1. `prisma/schema.prisma`: add the model (the template references a `Feature`
   model), run `pnpm --filter api db:migrate`.
2. Copy `apps/api/templates/feature/` → `src/modules/<feature>/` and rename
   `feature` → `<feature>`.
3. Add the shared domain schemas/types (`createFeatureBodySchema`,
   `CreateFeatureInput`, `Feature`, …) to `packages/shared-schemas` /
   `packages/shared-types` if the frontend also needs them; otherwise inline the
   bodies in the module's `*.schema.ts`.
4. Mount the router in `src/routes/index.ts` via `router.use('/<features>', featureRouter)`.
5. The template includes both `*.test.ts` files (service + supertest route
   tests); adjust the URLs and fixtures to match.

The `apps/api/templates/feature/` folder is the canonical source for new module structure. Existing modules may contain feature-specific differences and should not be treated as templates.

## Testing

- Vitest (`vitest.config.ts`, `@` alias, `src/**/*.test.ts`).
- Route tests use `supertest` against `app` with `vi.mock` on the service.
- Service tests mock the repository with `vi.mock`.
- The `*.test.ts` files inside `apps/api/templates/feature/` show the pattern.
- Manual API exploration: `apps/api/requests.http` (REST Client / JetBrains HTTP client).

## Authentication

Authentication middleware is not currently implemented.

When authentication is added, guards should be applied at the module-router level rather than inside controllers or services.