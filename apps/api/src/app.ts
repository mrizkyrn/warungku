import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from '@/config/env.js';
import { errorHandler, notFoundHandler } from '@/middleware/error.middleware.js';
import { requestLogger } from '@/middleware/request-logger.middleware.js';
import { router } from '@/routes/index.js';

const app = express();

// Security & compression
app.use(helmet());
app.use(cors({ origin: env.cors.origin, credentials: true }));
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(requestLogger);

// Routes
app.use('/api/v1', router);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
