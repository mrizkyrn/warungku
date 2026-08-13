import type { CreateProductInput, UpdateProductInput } from '@warungku/shared-schemas';
import type { Product } from '@warungku/shared-types';

import { apiClient } from '@/lib/api-client.js';

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const productApi = {
  list: (params: ListProductsParams = {}) =>
    apiClient.getPaginated<Product[]>(
      '/products',
      params as Record<string, string | number | undefined>,
    ),

  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),

  create: (input: CreateProductInput) => apiClient.post<Product>('/products', input),

  update: (id: string, input: UpdateProductInput) =>
    apiClient.patch<Product>(`/products/${id}`, input),

  delete: (id: string) => apiClient.delete<void>(`/products/${id}`),
};
