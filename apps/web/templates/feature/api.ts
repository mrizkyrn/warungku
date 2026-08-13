import type { CreateFeatureInput, UpdateFeatureInput } from '@repo/shared-schemas';
import type { Feature } from '@repo/shared-types';

import { apiClient } from '@/lib/api-client.js';

export interface ListFeaturesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const featureApi = {
  list: (params: ListFeaturesParams = {}) =>
    apiClient.getPaginated<Feature[]>(
      '/features',
      params as Record<string, string | number | undefined>,
    ),

  getById: (id: string) => apiClient.get<Feature>(`/features/${id}`),

  create: (input: CreateFeatureInput) => apiClient.post<Feature>('/features', input),

  update: (id: string, input: UpdateFeatureInput) =>
    apiClient.patch<Feature>(`/features/${id}`, input),

  delete: (id: string) => apiClient.delete<void>(`/features/${id}`),
};
