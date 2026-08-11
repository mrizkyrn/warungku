import type { ApiResponseType, ApiSuccessResponse } from '@warungku/shared-types';

import { env } from '@/config/env.js';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errors?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

function buildUrl(path: string, params?: RequestOptions['params']): URL {
  const url = new URL(`${env.apiUrl}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  return url;
}

// Returns the full envelope (data + meta) — used internally by both get()
// and getPaginated() so list endpoints can access pagination info without
// a second, duplicated fetch implementation.
async function requestEnvelope<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const { params, ...init } = options;
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (res.status === 204) {
    return { success: true, message: 'No content' } as ApiSuccessResponse<T>;
  }

  const json = (await res.json()) as ApiResponseType<T>;

  if (!json.success) {
    throw new ApiError(json.message, res.status, json.errors);
  }

  return json;
}

export const apiClient = {
  get: async <T>(path: string, params?: RequestOptions['params']): Promise<T> => {
    const envelope = await requestEnvelope<T>(path, { method: 'GET', params });
    return envelope.data as T;
  },

  // For list endpoints — returns data alongside pagination meta.
  getPaginated: async <T>(path: string, params?: RequestOptions['params']) => {
    const envelope = await requestEnvelope<T>(path, { method: 'GET', params });
    return { data: envelope.data as T, meta: envelope.meta };
  },

  post: async <T>(path: string, body?: unknown): Promise<T> => {
    const envelope = await requestEnvelope<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return envelope.data as T;
  },

  patch: async <T>(path: string, body?: unknown): Promise<T> => {
    const envelope = await requestEnvelope<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    return envelope.data as T;
  },

  delete: async <T>(path: string): Promise<T> => {
    const envelope = await requestEnvelope<T>(path, { method: 'DELETE' });
    return envelope.data as T;
  },
};
