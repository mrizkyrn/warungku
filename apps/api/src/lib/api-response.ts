import type { ApiErrorResponse, ApiSuccessResponse, PaginationMeta } from '@warungku/shared-types';
import type { Response } from 'express';

interface SuccessOptions<T> {
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  statusCode?: number;
}

interface ErrorOptions {
  message: string;
  statusCode: number;
  errors?: ApiErrorResponse['errors'];
}

export class ApiResponse {
  static success<T>(res: Response, options: SuccessOptions<T> = {}): Response {
    const { message = 'Success', data, meta, statusCode = 200 } = options;

    const body: ApiSuccessResponse<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta }),
    };

    return res.status(statusCode).json(body);
  }

  static created<T>(res: Response, data?: T, message = 'Resource created'): Response {
    return this.success(res, { statusCode: 201, message, data });
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  static error(res: Response, options: ErrorOptions): Response {
    const { message, statusCode, errors } = options;

    const body: ApiErrorResponse = {
      success: false,
      message,
      ...(errors !== undefined && { errors }),
    };

    return res.status(statusCode).json(body);
  }
}
