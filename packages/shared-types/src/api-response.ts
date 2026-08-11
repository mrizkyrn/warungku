export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

export type ApiResponseType<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
