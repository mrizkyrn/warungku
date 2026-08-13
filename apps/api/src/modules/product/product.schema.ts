import { createProductBodySchema, updateProductBodySchema } from '@warungku/shared-schemas';
import { z } from 'zod';

// ── Request-envelope wrapping ────────────────────────────────────────────

const productIdParam = z.object({
  id: z.cuid2('Invalid product id'),
});

export const createProductSchema = z.object({
  body: createProductBodySchema,
});

export const updateProductSchema = z.object({
  params: productIdParam,
  body: updateProductBodySchema,
});

export const getProductSchema = z.object({
  params: productIdParam,
});

export const deleteProductSchema = z.object({
  params: productIdParam,
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().min(1).optional(),
  }),
});

export type ListProductsQuery = z.infer<typeof listProductsSchema>['query'];
