import { type Prisma, prisma, type Product, type ProductOption } from '@/lib/db.js';

type ProductWithOptions = Product & { options: ProductOption[] };

interface FindManyParams {
  skip: number;
  take: number;
  search?: string;
}

export interface CreateProductData {
  name: string;
  options: Prisma.ProductOptionCreateWithoutProductInput[];
}

export interface ReplaceOptionsData {
  name?: string;
  options: Prisma.ProductOptionCreateWithoutProductInput[];
}

const includeOptions = {
  options: {
    orderBy: { createdAt: 'asc' as const },
  },
} satisfies Prisma.ProductInclude;

function buildSearchWhere(search?: string): Prisma.ProductWhereInput {
  if (!search) return {};

  return {
    name: { contains: search, mode: 'insensitive' },
  };
}

export const productRepository = {
  findById(id: string): Promise<ProductWithOptions | null> {
    return prisma.product.findUnique({
      where: { id },
      include: includeOptions,
    });
  },

  findMany({ skip, take, search }: FindManyParams): Promise<ProductWithOptions[]> {
    return prisma.product.findMany({
      where: buildSearchWhere(search),
      include: includeOptions,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count(search?: string): Promise<number> {
    return prisma.product.count({ where: buildSearchWhere(search) });
  },

  create(data: CreateProductData): Promise<ProductWithOptions> {
    return prisma.product.create({
      data: {
        name: data.name,
        options: { create: data.options },
      },
      include: includeOptions,
    });
  },

  updateName(id: string, name: string): Promise<ProductWithOptions> {
    return prisma.product.update({
      where: { id },
      data: { name },
      include: includeOptions,
    });
  },

  replaceOptions(id: string, data: ReplaceOptionsData): Promise<ProductWithOptions> {
    return prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        options: { deleteMany: {}, create: data.options },
      },
      include: includeOptions,
    });
  },

  delete(id: string): Promise<Product> {
    return prisma.product.delete({ where: { id } });
  },
};
