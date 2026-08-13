import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import app from '@/app.js';

import { productService } from './product.service.js';

vi.mock('./product.service.js', () => ({
  productService: {
    create: vi.fn(),
    getById: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockOption = {
  id: 'clx0000000000000000000op',
  productId: 'clx0000000000000000000p0',
  name: 'Reguler',
  price: 15000,
  unit: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const mockProduct = {
  id: 'clx0000000000000000000p0',
  name: 'Kopi Susu',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  options: [mockOption],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/v1/products', () => {
  it('returns 201 with the created product', async () => {
    vi.mocked(productService.create).mockResolvedValue(mockProduct as never);

    const res = await request(app)
      .post('/api/v1/products')
      .send({ name: mockProduct.name, options: [{ name: 'Reguler', price: 15000 }] });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ success: true, data: { name: mockProduct.name } });
    expect(productService.create).toHaveBeenCalledWith({
      name: mockProduct.name,
      options: [{ name: 'Reguler', price: 15000 }],
    });
  });

  it('returns 400 with field-level errors when the body is invalid', async () => {
    const res = await request(app).post('/api/v1/products').send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('name');
    expect(productService.create).not.toHaveBeenCalled();
  });

  it('returns 400 when no options are provided', async () => {
    const res = await request(app).post('/api/v1/products').send({ name: 'Kopi Susu' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('options');
    expect(productService.create).not.toHaveBeenCalled();
  });

  it('returns 201 for a default price option (single option without a name)', async () => {
    vi.mocked(productService.create).mockResolvedValue(mockProduct as never);

    const res = await request(app)
      .post('/api/v1/products')
      .send({ name: mockProduct.name, options: [{ price: 15000 }] });

    expect(res.status).toBe(201);
    expect(productService.create).toHaveBeenCalledWith({
      name: mockProduct.name,
      options: [{ price: 15000 }],
    });
  });

  it('returns 400 when an option is missing its name and is not the default price', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        name: 'Kopi Susu',
        options: [{ name: 'Reguler', price: 15000 }, { price: 18000 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('options.1.name');
    expect(productService.create).not.toHaveBeenCalled();
  });
});

describe('GET /api/v1/products', () => {
  it('returns 200 with paginated data', async () => {
    vi.mocked(productService.list).mockResolvedValue({
      data: [mockProduct],
      page: 1,
      limit: 10,
      total: 1,
    } as never);

    const res = await request(app).get('/api/v1/products').query({ page: 1, limit: 10 });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
    expect(productService.list).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  it('passes the search term to the service', async () => {
    vi.mocked(productService.list).mockResolvedValue({
      data: [],
      page: 1,
      limit: 10,
      total: 0,
    } as never);

    const res = await request(app).get('/api/v1/products').query({ search: 'kopi' });

    expect(res.status).toBe(200);
    expect(productService.list).toHaveBeenCalledWith({ page: 1, limit: 10, search: 'kopi' });
  });
});

describe('GET /api/v1/products/:id', () => {
  it('returns 200 with the product when found', async () => {
    vi.mocked(productService.getById).mockResolvedValue(mockProduct as never);

    const res = await request(app).get(`/api/v1/products/${mockProduct.id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(mockProduct.id);
  });

  it('returns 400 when the id is not a valid cuid', async () => {
    const res = await request(app).get('/api/v1/products/not-a-valid-id');

    expect(res.status).toBe(400);
    expect(productService.getById).not.toHaveBeenCalled();
  });
});

describe('PATCH /api/v1/products/:id', () => {
  it('returns 400 when the body is empty', async () => {
    const res = await request(app).patch(`/api/v1/products/${mockProduct.id}`).send({});

    expect(res.status).toBe(400);
    expect(productService.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/v1/products/:id', () => {
  it('returns 204 with no body when deleted', async () => {
    vi.mocked(productService.delete).mockResolvedValue(undefined as never);

    const res = await request(app).delete(`/api/v1/products/${mockProduct.id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
});
