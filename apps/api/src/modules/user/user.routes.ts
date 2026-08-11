import { Router } from 'express';

import { validate } from '@/middleware/validate.middleware.js';

import { userController } from './user.controller.js';
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  listUsersSchema,
  updateUserSchema,
} from './user.schema.js';

export const userRouter = Router();

userRouter.post('/', validate(createUserSchema), userController.create);

userRouter.get('/', validate(listUsersSchema), userController.list);

userRouter.get('/:id', validate(getUserSchema), userController.getById);

userRouter.patch(
  '/:id',
  // TODO: requireAuth, requireRole('admin') — once auth module exists
  validate(updateUserSchema),
  userController.update,
);

userRouter.delete(
  '/:id',
  // TODO: requireAuth, requireRole('admin') — once auth module exists
  validate(deleteUserSchema),
  userController.delete,
);
