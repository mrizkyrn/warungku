import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateProductInput, UpdateProductInput } from '@warungku/shared-schemas';

import { type ListProductsParams, productApi } from './api.js';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ListProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export function useProductsQuery(params: ListProductsParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productApi.list(params),
  });
}

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => productApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProductMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProductInput) => productApi.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
