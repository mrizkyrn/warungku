import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConflictError, NotFoundError } from '@/errors/app-error.js';

import { userRepository } from './user.repository.js';
import { userService } from './user.service.js';

vi.mock('./user.repository.js', () => ({
  userRepository: {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockUser = {
  id: 'clx000000000000000000000',
  email: 'jane@example.com',
  name: 'Jane Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('userService.create', () => {
  it('creates a user when the email is not already taken', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null);
    vi.mocked(userRepository.create).mockResolvedValue(mockUser);

    const result = await userService.create({ email: mockUser.email, name: mockUser.name });

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(userRepository.create).toHaveBeenCalledWith({
      email: mockUser.email,
      name: mockUser.name,
    });
    expect(result).toEqual(mockUser);
  });

  it('throws ConflictError when the email is already registered', async () => {
    vi.mocked(userRepository.findByEmail).mockResolvedValue(mockUser);

    await expect(
      userService.create({ email: mockUser.email, name: mockUser.name }),
    ).rejects.toThrow(ConflictError);

    expect(userRepository.create).not.toHaveBeenCalled();
  });
});

describe('userService.getById', () => {
  it('returns the user when found', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);

    const result = await userService.getById(mockUser.id);

    expect(result).toEqual(mockUser);
  });

  it('throws NotFoundError when the user does not exist', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(userService.getById('missing-id')).rejects.toThrow(NotFoundError);
  });
});

describe('userService.list', () => {
  it('computes skip/take from page and limit, and returns pagination fields', async () => {
    vi.mocked(userRepository.findMany).mockResolvedValue([mockUser]);
    vi.mocked(userRepository.count).mockResolvedValue(1);

    const result = await userService.list({ page: 2, limit: 10 });

    expect(userRepository.findMany).toHaveBeenCalledWith({
      skip: 10, // (page 2 - 1) * limit 10
      take: 10,
      search: undefined,
    });
    expect(result).toEqual({ data: [mockUser], page: 2, limit: 10, total: 1 });
  });

  it('passes the search term through to the repository', async () => {
    vi.mocked(userRepository.findMany).mockResolvedValue([]);
    vi.mocked(userRepository.count).mockResolvedValue(0);

    await userService.list({ page: 1, limit: 10, search: 'jane' });

    expect(userRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'jane' }),
    );
    expect(userRepository.count).toHaveBeenCalledWith('jane');
  });
});

describe('userService.update', () => {
  it('throws NotFoundError when the user does not exist', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(userService.update('missing-id', { name: 'New Name' })).rejects.toThrow(
      NotFoundError,
    );
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('throws ConflictError when changing to an email already taken by someone else', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);
    vi.mocked(userRepository.findByEmail).mockResolvedValue({
      ...mockUser,
      id: 'a-different-id',
    });

    await expect(userService.update(mockUser.id, { email: 'taken@example.com' })).rejects.toThrow(
      ConflictError,
    );
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('updates when the email is unchanged', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);
    vi.mocked(userRepository.update).mockResolvedValue({ ...mockUser, name: 'Updated' });

    const result = await userService.update(mockUser.id, { name: 'Updated' });

    expect(userRepository.findByEmail).not.toHaveBeenCalled();
    expect(result.name).toBe('Updated');
  });
});

describe('userService.delete', () => {
  it('throws NotFoundError when the user does not exist', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(userService.delete('missing-id')).rejects.toThrow(NotFoundError);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });

  it('deletes the user when found', async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(mockUser);
    vi.mocked(userRepository.delete).mockResolvedValue(mockUser);

    await userService.delete(mockUser.id);

    expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
  });
});
