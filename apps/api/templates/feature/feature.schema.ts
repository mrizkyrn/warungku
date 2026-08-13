import { z } from 'zod';

// ── Domain bodies — pull these from @repo/shared-schemas if the frontend needs them ──

export const createFeatureBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
});

export const updateFeatureBodySchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

// ── Request-envelope wrapping ────────────────────────────────────────────

const featureIdParam = z.object({
  id: z.cuid2('Invalid feature id'),
});

export const createFeatureSchema = z.object({
  body: createFeatureBodySchema,
});

export const updateFeatureSchema = z.object({
  params: featureIdParam,
  body: updateFeatureBodySchema,
});

export const getFeatureSchema = z.object({
  params: featureIdParam,
});

export const deleteFeatureSchema = z.object({
  params: featureIdParam,
});

export const listFeaturesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().min(1).optional(),
  }),
});

export type ListFeaturesQuery = z.infer<typeof listFeaturesSchema>['query'];
