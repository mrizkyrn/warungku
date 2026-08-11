import 'dotenv/config';

import { env } from '@/config/env.js';
import { connectDatabase, disconnectDatabase } from '@/lib/db.js';
import { logger } from '@/lib/logger.js';

import app from './app.js';

const SHUTDOWN_TIMEOUT = 30_000; // 30s for graceful shutdown

async function bootstrap() {
  try {
    await connectDatabase();
    logger.info('Database connected');
  } catch (error) {
    logger.error(error, 'Failed to connect database');
    process.exit(1);
  }

  const server = app.listen(env.app.port, () => {
    logger.info(`Server running on port ${env.app.port}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received, shutting down gracefully`);

    // Stop accepting new requests
    server.close(() => {
      disconnectDatabase()
        .then(() => {
          logger.info('Database disconnected');
          process.exit(0);
        })
        .catch((error) => {
          logger.error(error, 'Failed to disconnect database');
          process.exit(1);
        });
    });

    // Force shutdown if graceful shutdown times out
    setTimeout(() => {
      logger.error('Graceful shutdown timeout, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  // Unhandled errors — crash fast so process manager restarts
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'Unhandled promise rejection');
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    logger.error(error, 'Uncaught exception');
    process.exit(1);
  });
}

void bootstrap();
