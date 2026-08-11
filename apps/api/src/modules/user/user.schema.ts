import { createUserBodySchema, updateUserBodySchema, userIdSchema } from '@warungku/shared-schemas';
import { z } from 'zod';

// ── Request-envelope wrapping ────────────────────────────────────────────

const userIdParam = z.object({
  id: userIdSchema,
});

// ── Create ────────────────────────────────────────────────────────────────

export const createUserSchema = z.object({
  body: createUserBodySchema,
});

// ── Update (partial) ─────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  params: userIdParam,
  body: updateUserBodySchema,
});

// ── Get by id / Delete (share the same params shape) ────────────────────

export const getUserSchema = z.object({
  params: userIdParam,
});

export const deleteUserSchema = z.object({
  params: userIdParam,
});

// ── List (paginated, offset-based) — API-only, not shared ───────────────

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().min(1).optional(),
  }),
});

export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
