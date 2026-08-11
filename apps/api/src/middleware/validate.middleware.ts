import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodType } from 'zod';

export const validate =
  (schema: ZodType): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return next(result.error);
    }

    req.validated = result.data as Request['validated'];

    next();
  };
