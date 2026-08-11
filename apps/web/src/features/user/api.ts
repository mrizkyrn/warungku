import type { CreateUserInput, UpdateUserInput } from '@warungku/shared-schemas';
import type { User } from '@warungku/shared-types';

import { apiClient } from '@/lib/api-client.js';

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const userApi = {
  list: (params: ListUsersParams = {}) =>
    apiClient.getPaginated<User[]>('/users', params as Record<string, string | number | undefined>),

  getById: (id: string) => apiClient.get<User>(`/users/${id}`),

  create: (input: CreateUserInput) => apiClient.post<User>('/users', input),

  update: (id: string, input: UpdateUserInput) => apiClient.patch<User>(`/users/${id}`, input),

  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),
};
