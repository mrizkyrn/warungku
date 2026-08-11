import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '@/config/env.js';

import { PrismaClient } from '../../generated/prisma/client.js';
import { logger } from './logger.js';

export * from '../../generated/prisma/client.js';

const adapter = new PrismaPg({
  connectionString: env.db.url,
});

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (!env.app.isProduction) {
  globalThis.prisma = prisma;
}

prisma.$on('query', (event) => {
  logger.debug({
    query: event.query,
    duration: event.duration,
  });
});

export async function connectDatabase() {
  try {
    await prisma.$connect();

    logger.info('Database connected');
  } catch (error) {
    logger.error(
      {
        error,
      },
      'Database connection failed',
    );

    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();

  logger.info('Database disconnected');
}
