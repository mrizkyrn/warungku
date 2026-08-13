import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFoundError } from '@/errors/app-error.js';

import { productRepository } from './product.repository.js';
import { productService } from './product.service.js';

vi.mock('./product.repository.js', () => ({
  productRepository: {
    findById: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    updateName: vi.fn(),
    replaceOptions: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockOption = {
  id: 'clx0000000000000000000op',
  productId: 'clx0000000000000000000p0',
  name: 'Reguler',
  price: 15000,
  unit: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

const mockProduct = {
  id: 'clx0000000000000000000p0',
  name: 'Contoh Produk',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  options: [mockOption],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('productService.create', () => {
  it('creates a product with its options', async () => {
    vi.mocked(productRepository.create).mockResolvedValue(mockProduct);

    const input = { name: mockProduct.name, options: [{ name: 'Reguler', price: 15000 }] };
    const result = await productService.create(input);

    expect(productRepository.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockProduct);
  });
});

describe('productService.getById', () => {
  it('returns the product when found', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);

    const result = await productService.getById(mockProduct.id);

    expect(result).toEqual(mockProduct);
  });

  it('throws NotFoundError when the product does not exist', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null);

    await expect(productService.getById('missing-id')).rejects.toThrow(NotFoundError);
  });
});

describe('productService.list', () => {
  it('computes skip/take from page and limit, and passes the search term', async () => {
    vi.mocked(productRepository.findMany).mockResolvedValue([mockProduct]);
    vi.mocked(productRepository.count).mockResolvedValue(1);

    const result = await productService.list({ page: 2, limit: 10, search: 'kopi' });

    expect(productRepository.findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      search: 'kopi',
    });
    expect(productRepository.count).toHaveBeenCalledWith('kopi');
    expect(result).toEqual({ data: [mockProduct], page: 2, limit: 10, total: 1 });
  });
});

describe('productService.update', () => {
  it('throws NotFoundError when the product does not exist', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null);

    await expect(productService.update('missing-id', { name: 'Baru' })).rejects.toThrow(
      NotFoundError,
    );
    expect(productRepository.updateName).not.toHaveBeenCalled();
    expect(productRepository.replaceOptions).not.toHaveBeenCalled();
  });

  it('replaces the option set when options are provided', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);
    vi.mocked(productRepository.replaceOptions).mockResolvedValue({
      ...mockProduct,
      options: [{ ...mockOption, price: 18000 }],
    });

    const input = {
      name: mockProduct.name,
      options: [{ name: 'Reguler', price: 18000 }],
    };

    const result = await productService.update(mockProduct.id, input);

    expect(productRepository.replaceOptions).toHaveBeenCalledWith(mockProduct.id, input);
    expect(productRepository.updateName).not.toHaveBeenCalled();
    expect(result.options[0].price).toBe(18000);
  });

  it('only updates the name when options are not provided', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);
    vi.mocked(productRepository.updateName).mockResolvedValue({
      ...mockProduct,
      name: 'Nama Baru',
    });

    const result = await productService.update(mockProduct.id, { name: 'Nama Baru' });

    expect(productRepository.updateName).toHaveBeenCalledWith(mockProduct.id, 'Nama Baru');
    expect(productRepository.replaceOptions).not.toHaveBeenCalled();
    expect(result.name).toBe('Nama Baru');
  });
});

describe('productService.delete', () => {
  it('throws NotFoundError when the product does not exist', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null);

    await expect(productService.delete('missing-id')).rejects.toThrow(NotFoundError);
    expect(productRepository.delete).not.toHaveBeenCalled();
  });

  it('deletes the product when found', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(mockProduct);
    vi.mocked(productRepository.delete).mockResolvedValue(mockProduct);

    await productService.delete(mockProduct.id);

    expect(productRepository.delete).toHaveBeenCalledWith(mockProduct.id);
  });
});
