import type { CreateUserInput, UpdateUserInput } from '@warungku/shared-schemas';

import { ConflictError, NotFoundError } from '@/errors/app-error.js';

import { userRepository } from './user.repository.js';
import type { ListUsersQuery } from './user.schema.js';

export const userService = {
  async create(input: CreateUserInput) {
    const existing = await userRepository.findByEmail(input.email);

    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    return userRepository.create(input);
  },

  async getById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  },

  async list(query: ListUsersQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      userRepository.findMany({ skip, take: limit, search }),
      userRepository.count(search),
    ]);

    return { data, page, limit, total };
  },

  async update(id: string, input: UpdateUserInput) {
    const existing = await userRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    if (input.email && input.email !== existing.email) {
      const emailTaken = await userRepository.findByEmail(input.email);

      if (emailTaken) {
        throw new ConflictError('Email is already registered');
      }
    }

    return userRepository.update(id, input);
  },

  async delete(id: string) {
    const existing = await userRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    await userRepository.delete(id);
  },
};
