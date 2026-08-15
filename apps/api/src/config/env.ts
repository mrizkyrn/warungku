import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const rawEnv = envSchema.parse(process.env);

export const env = {
  app: {
    nodeEnv: rawEnv.NODE_ENV,
    isDevelopment: rawEnv.NODE_ENV === 'development',
    isProduction: rawEnv.NODE_ENV === 'production',
    port: rawEnv.PORT,
  },
  db: {
    url: rawEnv.DATABASE_URL,
  },
  cors: {
    origin: rawEnv.CORS_ORIGIN,
  },
} as const;
