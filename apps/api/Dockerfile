# syntax=docker/dockerfile:1
#
# Build context MUST be the monorepo root (not apps/api), e.g.:
#   docker build -f apps/api/Dockerfile -t api:latest .
# This is required because pnpm workspaces + the shared packages
# (@warungku/shared-types, @warungku/shared-schemas) must be visible to the
# build.
#
# Uses `pnpm deploy --prod` (pnpm 9.x) to assemble a self-contained runtime
# directory for the `api` package: it resolves and copies in workspace deps
# (@warungku/shared-types, @warungku/shared-schemas) as real files, not
# symlinks, and prunes devDependencies. This replaces manually copying
# node_modules/packages/dist across stages.
#
# NOTE: `pnpm deploy --prod` prunes devDependencies, which includes the
# `prisma` CLI. That's fine here because migrations are run as a separate
# step in CI (`prisma migrate deploy`, see .github/workflows/deploy-api.yml)
# BEFORE this container is deployed/restarted — not at container boot. If
# you ever need the prisma CLI inside this image again, use
# `pnpm deploy --prod=false` instead, at the cost of a larger image.

ARG NODE_VERSION=24

# ---------------------------------------------------------------------------
# Build: install full workspace deps, generate Prisma client, bundle with
# tsup, then assemble the prod-only deploy output for `api`.
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS build
RUN corepack enable
WORKDIR /repo

# Copy workspace manifests first for better layer caching.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared-types/package.json ./packages/shared-types/package.json
COPY packages/shared-schemas/package.json ./packages/shared-schemas/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api ./apps/api
COPY packages/shared-types ./packages/shared-types
COPY packages/shared-schemas ./packages/shared-schemas

# `pnpm --filter api build` runs `prisma generate && tsup ...`.
# Prisma 7 + @prisma/adapter-pg is the driver adapter (pure JS, queries over
# `pg`), so there is no query-engine binary to worry about copying into the
# runtime image.
RUN pnpm --filter api build

# Assemble the deployable directory: resolves @warungku/shared-types and
# @warungku/shared-schemas as real files, includes apps/api/dist (already
# built above), and prunes devDependencies (including the `prisma` CLI —
# see note at top of file).
RUN pnpm --filter api deploy --prod /deploy

# `pnpm deploy` does not copy generated/non-source files outside of what's
# declared in package.json's `files` field (if any) — copy the Prisma
# artifacts explicitly to be safe, since generated/ is gitignored and not
# guaranteed to be picked up otherwise.
RUN cp -r apps/api/generated /deploy/generated \
    && cp -r apps/api/prisma /deploy/prisma

# ---------------------------------------------------------------------------
# Runtime: minimal image, non-root user
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs apiuser

COPY --from=build /deploy ./

USER apiuser

EXPOSE 3000
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/api/v1/health',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"
    
CMD ["node", "dist/server.js"]