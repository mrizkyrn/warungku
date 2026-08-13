import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NotFoundError } from '@/errors/app-error.js';

import { featureRepository } from './feature.repository.js';
import { featureService } from './feature.service.js';

vi.mock('./feature.repository.js', () => ({
  featureRepository: {
    findById: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
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

describe('featureService.create', () => {
  it('creates a feature', async () => {
    vi.mocked(featureRepository.create).mockResolvedValue(mockFeature);

    const result = await featureService.create({ name: mockFeature.name });

    expect(featureRepository.create).toHaveBeenCalledWith({ name: mockFeature.name });
    expect(result).toEqual(mockFeature);
  });
});

describe('featureService.getById', () => {
  it('returns the feature when found', async () => {
    vi.mocked(featureRepository.findById).mockResolvedValue(mockFeature);

    const result = await featureService.getById(mockFeature.id);

    expect(result).toEqual(mockFeature);
  });

  it('throws NotFoundError when the feature does not exist', async () => {
    vi.mocked(featureRepository.findById).mockResolvedValue(null);

    await expect(featureService.getById('missing-id')).rejects.toThrow(NotFoundError);
  });
});

describe('featureService.list', () => {
  it('computes skip/take from page and limit, and returns pagination fields', async () => {
    vi.mocked(featureRepository.findMany).mockResolvedValue([mockFeature]);
    vi.mocked(featureRepository.count).mockResolvedValue(1);

    const result = await featureService.list({ page: 2, limit: 10 });

    expect(featureRepository.findMany).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      search: undefined,
    });
    expect(result).toEqual({ data: [mockFeature], page: 2, limit: 10, total: 1 });
  });
});

describe('featureService.update', () => {
  it('throws NotFoundError when the feature does not exist', async () => {
    vi.mocked(featureRepository.findById).mockResolvedValue(null);

    await expect(featureService.update('missing-id', { name: 'New Name' })).rejects.toThrow(
      NotFoundError,
    );
    expect(featureRepository.update).not.toHaveBeenCalled();
  });

  it('updates when the feature exists', async () => {
    vi.mocked(featureRepository.findById).mockResolvedValue(mockFeature);
    vi.mocked(featureRepository.update).mockResolvedValue({ ...mockFeature, name: 'Updated' });

    const result = await featureService.update(mockFeature.id, { name: 'Updated' });

    expect(result.name).toBe('Updated');
  });
});

describe('featureService.delete', () => {
  it('throws NotFoundError when the feature does not exist', async () => {
    vi.mocked(featureRepository.findById).mockResolvedValue(null);

    await expect(featureService.delete('missing-id')).rejects.toThrow(NotFoundError);
    expect(featureRepository.delete).not.toHaveBeenCalled();
  });

  it('deletes the feature when found', async () => {
    vi.mocked(featureRepository.findById).mockResolvedValue(mockFeature);
    vi.mocked(featureRepository.delete).mockResolvedValue(mockFeature);

    await featureService.delete(mockFeature.id);

    expect(featureRepository.delete).toHaveBeenCalledWith(mockFeature.id);
  });
});
