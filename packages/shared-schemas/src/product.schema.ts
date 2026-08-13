import { z } from 'zod';

// ── Field-level primitives ───────────────────────────────────────────────

export const unitSchema = z.enum(['GRAM', 'KILOGRAM', 'MILLILITER', 'LITER']);

export const productNameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters');

export const productOptionNameSchema = z
  .string()
  .trim()
  .max(100, 'Option name must be at most 100 characters')
  .nullable()
  .optional();

export const productOptionPriceSchema = z
  .number()
  .int('Price must be a whole number')
  .min(1, 'Price must be at least 1');

// ── Option ───────────────────────────────────────────────────────────────

export const productOptionBodySchema = z.object({
  name: productOptionNameSchema,
  price: productOptionPriceSchema,
  unit: unitSchema.optional(),
});

export type ProductOptionInput = z.infer<typeof productOptionBodySchema>;

// ── Options array ────────────────────────────────────────────────────────
// A single unnamed option acts as the product's default price. Once there
// are multiple options, every option must have a name.

export const productOptionsSchema = z
  .array(productOptionBodySchema)
  .min(1, 'At least one option is required')
  .max(50, 'Too many options')
  .superRefine((options, ctx) => {
    const isDefaultPrice = options.length === 1 && !options[0]?.name?.trim();

    if (isDefaultPrice) return;

    options.forEach((option, index) => {
      if (!option.name?.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: [index, 'name'],
          message: 'Option name is required',
        });
      }
    });
  });

// ── Create ────────────────────────────────────────────────────────────────

export const createProductBodySchema = z.object({
  name: productNameSchema,
  options: productOptionsSchema,
});

export type CreateProductInput = z.infer<typeof createProductBodySchema>;

// ── Update (partial, options replace the full set when present) ──────────

export const updateProductBodySchema = z
  .object({
    name: productNameSchema.optional(),
    options: productOptionsSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateProductInput = z.infer<typeof updateProductBodySchema>;
