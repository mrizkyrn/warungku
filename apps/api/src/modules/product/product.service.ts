import type { CreateProductInput, UpdateProductInput } from '@warungku/shared-schemas';

import { NotFoundError } from '@/errors/app-error.js';

import type { CreateProductData, ReplaceOptionsData } from './product.repository.js';
import { productRepository } from './product.repository.js';
import type { ListProductsQuery } from './product.schema.js';

export const productService = {
  async create(input: CreateProductInput) {
    const data: CreateProductData = {
      name: input.name,
      options: input.options,
    };

    return productRepository.create(data);
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    return product;
  },

  async list(query: ListProductsQuery) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      productRepository.findMany({ skip, take: limit, search }),
      productRepository.count(search),
    ]);

    return { data, page, limit, total };
  },

  async update(id: string, input: UpdateProductInput) {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    if (input.options !== undefined) {
      const data: ReplaceOptionsData = {
        name: input.name,
        options: input.options,
      };

      return productRepository.replaceOptions(id, data);
    }

    return productRepository.updateName(id, input.name as string);
  },

  async delete(id: string) {
    const existing = await productRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }

    await productRepository.delete(id);
  },
};
