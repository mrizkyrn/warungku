import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import app from '@/app.js';

import { featureService } from './feature.service.js';

vi.mock('./feature.service.js', () => ({
  featureService: {
    create: vi.fn(),
    getById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockFeature = {
  id: 'clx000000000000000000000',
  name: 'Example feature',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/v1/features', () => {
  it('returns 201 with the created feature', async () => {
    vi.mocked(featureService.create).mockResolvedValue(mockFeature as never);

    const res = await request(app).post('/api/v1/features').send({ name: mockFeature.name });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true, data: { name: mockFeature.name } });
  });

  it('returns 400 with field-level errors when the body is invalid', async () => {
    const res = await request(app).post('/api/v1/features').send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('name');
    expect(featureService.create).not.toHaveBeenCalled();
  });
});

describe('GET /api/v1/features', () => {
  it('returns 200 with paginated data', async () => {
    vi.mocked(featureService.list).mockResolvedValue({
      data: [mockFeature],
      page: 1,
      limit: 10,
      total: 1,
    } as never);

    const res = await request(app).get('/api/v1/features').query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
  });
});

describe('GET /api/v1/features/:id', () => {
  it('returns 200 with the feature when found', async () => {
    vi.mocked(featureService.getById).mockResolvedValue(mockFeature as never);

    const res = await request(app).get(`/api/v1/features/${mockFeature.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(mockFeature.id);
  });

  it('returns 400 when the id is not a valid cuid', async () => {
    const res = await request(app).get('/api/v1/features/not-a-valid-id');

    expect(res.status).toBe(400);
    expect(featureService.getById).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/v1/features/:id', () => {
  it('returns 400 when the body is empty', async () => {
    const res = await request(app).patch(`/api/v1/features/${mockFeature.id}`).send({});

    expect(res.status).toBe(400);
    expect(featureService.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/v1/features/:id', () => {
  it('returns 204 with no body when deleted', async () => {
    vi.mocked(featureService.delete).mockResolvedValue(undefined as never);

    const res = await request(app).delete(`/api/v1/features/${mockFeature.id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
});
