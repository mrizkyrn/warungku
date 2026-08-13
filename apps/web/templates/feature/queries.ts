import type { CreateFeatureInput, UpdateFeatureInput } from '@repo/shared-schemas';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { type ListFeaturesParams, featureApi } from './api.js';

export const featureKeys = {
  all: ['features'] as const,
  lists: () => [...featureKeys.all, 'list'] as const,
  list: (params: ListFeaturesParams) => [...featureKeys.lists(), params] as const,
  details: () => [...featureKeys.all, 'detail'] as const,
  detail: (id: string) => [...featureKeys.details(), id] as const,
};

export function useFeaturesQuery(params: ListFeaturesParams = {}) {
  return useQuery({
    queryKey: featureKeys.list(params),
    queryFn: () => featureApi.list(params),
  });
}

export function useFeatureQuery(id: string) {
  return useQuery({
    queryKey: featureKeys.detail(id),
    queryFn: () => featureApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateFeatureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFeatureInput) => featureApi.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: featureKeys.lists() });
    },
  });
}

export function useUpdateFeatureMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateFeatureInput) => featureApi.update(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: featureKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: featureKeys.detail(id) });
    },
  });
}

export function useDeleteFeatureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: featureKeys.lists() });
    },
  });
}
