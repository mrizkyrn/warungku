import type { CreateFeatureInput, UpdateFeatureInput } from '@repo/shared-schemas';
import type { RequestHandler } from 'express';

import { ApiResponse } from '@/lib/api-response.js';

import type { ListFeaturesQuery } from './feature.schema.js';
import { featureService } from './feature.service.js';

export const featureController = {
  create: (async (req, res) => {
    const body = req.validated.body as CreateFeatureInput;
    const feature = await featureService.create(body);
    ApiResponse.created(res, feature, 'Feature created successfully');
  }) satisfies RequestHandler,

  list: (async (req, res) => {
    const query = req.validated.query as ListFeaturesQuery;
    const { data, page, limit, total } = await featureService.list(query);
    ApiResponse.success(res, {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }) satisfies RequestHandler,

  getById: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const feature = await featureService.getById(id);
    ApiResponse.success(res, { data: feature });
  }) satisfies RequestHandler,

  update: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const body = req.validated.body as UpdateFeatureInput;
    const feature = await featureService.update(id, body);
    ApiResponse.success(res, { data: feature, message: 'Feature updated successfully' });
  }) satisfies RequestHandler,

  delete: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    await featureService.delete(id);
    ApiResponse.noContent(res);
  }) satisfies RequestHandler,
};
