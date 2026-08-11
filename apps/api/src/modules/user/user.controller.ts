import type { CreateUserInput, UpdateUserInput } from '@warungku/shared-schemas';
import type { RequestHandler } from 'express';

import { ApiResponse } from '@/lib/api-response.js';

import type { ListUsersQuery } from './user.schema.js';
import { userService } from './user.service.js';

export const userController = {
  create: (async (req, res) => {
    const body = req.validated.body as CreateUserInput;
    const user = await userService.create(body);
    ApiResponse.created(res, user, 'User created successfully');
  }) satisfies RequestHandler,

  list: (async (req, res) => {
    const query = req.validated.query as ListUsersQuery;
    const { data, page, limit, total } = await userService.list(query);
    ApiResponse.success(res, {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }) satisfies RequestHandler,

  getById: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const user = await userService.getById(id);
    ApiResponse.success(res, { data: user });
  }) satisfies RequestHandler,

  update: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    const body = req.validated.body as UpdateUserInput;
    const user = await userService.update(id, body);
    ApiResponse.success(res, { data: user, message: 'User updated successfully' });
  }) satisfies RequestHandler,

  delete: (async (req, res) => {
    const { id } = req.validated.params as { id: string };
    await userService.delete(id);
    ApiResponse.noContent(res);
  }) satisfies RequestHandler,
};
