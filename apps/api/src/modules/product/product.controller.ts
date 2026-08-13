import type { CreateProductInput, UpdateProductInput } from '@warungku/shared-schemas';
import type { RequestHandler } from 'express';

import { ApiResponse } from '@/lib/api-response.js';

import type { ListProductsQuery } from './product.schema.js';
import { productService } from './product.service.js';

export const productController = {
  create: (async (req, res) => {
    const body = req.validated.body as CreateProductInput;
    const product = await productService.create(body);
    ApiResponse.created(res, product, 'Product created successfully');
  }) satisfies RequestHandler,

  list: (async (req, res) => {
    const query = req.validated.query as ListProductsQuery;
    const { data, page, limit, total } = await productService.list(query);
    ApiResponse.success(res, {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }) satisfies RequestHandler,

  getById: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const product = await productService.getById(id);
    ApiResponse.success(res, { data: product });
  }) satisfies RequestHandler,

  update: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const body = req.validated.body as UpdateProductInput;
    const product = await productService.update(id, body);
    ApiResponse.success(res, { data: product, message: 'Product updated successfully' });
  }) satisfies RequestHandler,

  delete: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    await productService.delete(id);
    ApiResponse.noContent(res);
  }) satisfies RequestHandler,
};
