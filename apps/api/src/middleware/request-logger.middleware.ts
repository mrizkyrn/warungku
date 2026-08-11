import { randomUUID } from 'node:crypto';

import { pinoHttp } from 'pino-http';

import { logger } from '@/lib/logger.js';

export const requestLogger = pinoHttp({
  logger,

  genReqId: (req, res) => {
    const existingId = req.headers['x-request-id'];
    if (existingId) return existingId as string;
    const id = randomUUID();
    res.setHeader('x-request-id', id);
    return id;
  },

  autoLogging: {
    ignore: (req) => req.url === '/health' || req.url === '/api/ping',
  },

  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      id: req.id,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },

  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },

  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req, res, err) =>
    `${req.method} ${req.url} ${res.statusCode} (${err.message})`,
});
