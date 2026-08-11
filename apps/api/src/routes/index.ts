import { Router } from 'express';

import { ApiResponse } from '@/lib/api-response.js';
import { userRouter } from '@/modules/user/user.routes.js';

export const router = Router();

// Health check
router.get('/health', (_req, res) => {
  ApiResponse.success(res, {
    message: 'OK',
    data: { uptime: process.uptime() },
  });
});

// Module routes
router.use('/users', userRouter);
