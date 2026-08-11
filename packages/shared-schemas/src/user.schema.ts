import { z } from 'zod';

// ── Field-level primitives ───────────────────────────────────────────────

export const userIdSchema = z.cuid2('Invalid user id');
export const userEmailSchema = z.email('Invalid email address');
export const userNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters');

// ── Create ────────────────────────────────────────────────────────────────

export const createUserBodySchema = z.object({
  email: userEmailSchema,
  name: userNameSchema,
});

export type CreateUserInput = z.infer<typeof createUserBodySchema>;

// ── Update (partial) ─────────────────────────────────────────────────────

export const updateUserBodySchema = z
  .object({
    email: userEmailSchema.optional(),
    name: userNameSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateUserInput = z.infer<typeof updateUserBodySchema>;
