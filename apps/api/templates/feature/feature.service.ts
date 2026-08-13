import type { CreateFeatureInput, UpdateFeatureInput } from '@repo/shared-schemas';

import { NotFoundError } from '@/errors/app-error.js';

import { featureRepository } from './feature.repository.js';
import type { ListFeaturesQuery } from './feature.schema.js';

export const featureService = {
  async create(input: CreateFeatureInput) {
    return featureRepository.create(input);
  },

  async getById(id: string) {
    const feature = await featureRepository.findById(id);

    if (!feature) {
      throw new NotFoundError(`Feature with id ${id} not found`);
    }

    return feature;
  },

  async list(query: ListFeaturesQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      featureRepository.findMany({ skip, take: limit, search }),
      featureRepository.count(search),
    ]);

    return { data, page, limit, total };
  },

  async update(id: string, input: UpdateFeatureInput) {
    const existing = await featureRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Feature with id ${id} not found`);
    }

    return featureRepository.update(id, input);
  },

  async delete(id: string) {
    const existing = await featureRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Feature with id ${id} not found`);
    }

    await featureRepository.delete(id);
  },
};
