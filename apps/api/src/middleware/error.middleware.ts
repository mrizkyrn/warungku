import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

import { AppError } from '@/errors/app-error.js';
import { ApiResponse } from '@/lib/api-response.js';
import { Prisma } from '@/lib/db.js';
import { logger } from '@/lib/logger.js';

function formatZodError(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const [, ...rest] = issue.path;
    const key = (rest.length > 0 ? rest : issue.path).join('.') || '_root';

    fieldErrors[key] ??= [];
    fieldErrors[key].push(issue.message);
  }

  return fieldErrors;
}

function formatPrismaUniqueConstraintError(
  error: Prisma.PrismaClientKnownRequestError,
): Record<string, string[]> {
  const target = error.meta?.target;
  const fields = Array.isArray(target) ? (target as string[]) : ['field'];

  const fieldErrors: Record<string, string[]> = {};
  for (const field of fields) {
    fieldErrors[field] = [`${field} is already taken`];
  }

  return fieldErrors;
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const context = {
    method: req.method,
    url: req.originalUrl,
    requestId: req.id,
  };

  if (error instanceof ZodError) {
    const errors = formatZodError(error);
    logger.debug({ ...context, errors }, 'Validation error detail');
    return ApiResponse.error(res, { statusCode: 400, message: 'Validation failed', errors });
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return ApiResponse.error(res, { statusCode: 400, message: 'Malformed JSON in request body' });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    const errors = formatPrismaUniqueConstraintError(error);
    logger.debug({ ...context, errors }, 'Unique constraint violation');
    return ApiResponse.error(res, {
      statusCode: 409,
      message: 'Resource already exists',
      errors,
    });
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error({ ...context, stack: error.stack }, error.message);
    }
    return ApiResponse.error(res, { statusCode: error.statusCode, message: error.message });
  }

  logger.error({ ...context, error }, 'Unexpected error');
  return ApiResponse.error(res, { statusCode: 500, message: 'Internal server error' });
};

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
};
