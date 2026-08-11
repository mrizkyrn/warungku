import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import app from '@/app.js';

import { userService } from './user.service.js';

vi.mock('./user.service.js', () => ({
  userService: {
    create: vi.fn(),
    getById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockUser = {
  id: 'clx000000000000000000000',
  email: 'jane@example.com',
  name: 'Jane Doe',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/v1/users', () => {
  it('returns 201 with the created user', async () => {
    vi.mocked(userService.create).mockResolvedValue(mockUser as never);

    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: mockUser.email, name: mockUser.name });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true, data: { email: mockUser.email } });
  });

  it('returns 400 with field-level errors when the body is invalid', async () => {
    const res = await request(app).post('/api/v1/users').send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors).toHaveProperty('name');
    expect(userService.create).not.toHaveBeenCalled();
  });
});

describe('GET /api/v1/users', () => {
  it('returns 200 with paginated data', async () => {
    vi.mocked(userService.list).mockResolvedValue({
      data: [mockUser],
      page: 1,
      limit: 10,
      total: 1,
    } as never);

    const res = await request(app).get('/api/v1/users').query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
  });

  it('returns 400 when limit exceeds the allowed maximum', async () => {
    const res = await request(app).get('/api/v1/users').query({ limit: 500 });

    expect(res.status).toBe(400);
    expect(userService.list).not.toHaveBeenCalled();
  });
});

describe('GET /api/v1/users/:id', () => {
  it('returns 200 with the user when found', async () => {
    vi.mocked(userService.getById).mockResolvedValue(mockUser as never);

    const res = await request(app).get(`/api/v1/users/${mockUser.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(mockUser.id);
  });

  it('returns 400 when the id is not a valid cuid', async () => {
    const res = await request(app).get('/api/v1/users/not-a-valid-id');

    expect(res.status).toBe(400);
    expect(userService.getById).not.toHaveBeenCalled();
  });

  it('returns 404 when the service throws NotFoundError', async () => {
    const { NotFoundError } = await import('@/errors/app-error.js');
    vi.mocked(userService.getById).mockRejectedValue(new NotFoundError('User not found'));

    const res = await request(app).get(`/api/v1/users/${mockUser.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ success: false, message: 'User not found' });
  });
});

describe('PATCH /api/v1/users/:id', () => {
  it('returns 400 when the body is empty', async () => {
    const res = await request(app).patch(`/api/v1/users/${mockUser.id}`).send({});

    expect(res.status).toBe(400);
    expect(userService.update).not.toHaveBeenCalled();
  });

  it('returns 200 when the update succeeds', async () => {
    vi.mocked(userService.update).mockResolvedValue({ ...mockUser, name: 'Updated' } as never);

    const res = await request(app).patch(`/api/v1/users/${mockUser.id}`).send({ name: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated');
  });
});

describe('DELETE /api/v1/users/:id', () => {
  it('returns 204 with no body when deleted', async () => {
    vi.mocked(userService.delete).mockResolvedValue(undefined as never);

    const res = await request(app).delete(`/api/v1/users/${mockUser.id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
});

describe('unmatched route', () => {
  it('returns 404 via the global notFoundHandler', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
