import pino from 'pino';

import { env } from '@/config/env.js';

export const logger = pino({
  level: env.app.isDevelopment ? 'debug' : 'info',

  transport: env.app.isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,

  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.accessToken',
      '*.refreshToken',
    ],
    censor: '[REDACTED]',
  },

  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
});
