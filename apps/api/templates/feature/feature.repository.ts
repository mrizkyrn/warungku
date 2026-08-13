import { type Prisma, prisma, type Feature } from '@/lib/db.js';

interface FindManyParams {
  skip: number;
  take: number;
  search?: string;
}

function buildSearchWhere(search?: string): Prisma.FeatureWhereInput {
  if (!search) return {};

  return {
    name: { contains: search, mode: 'insensitive' },
  };
}

export const featureRepository = {
  findById(id: string): Promise<Feature | null> {
    return prisma.feature.findUnique({ where: { id } });
  },

  findMany({ skip, take, search }: FindManyParams): Promise<Feature[]> {
    return prisma.feature.findMany({
      where: buildSearchWhere(search),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count(search?: string): Promise<number> {
    return prisma.feature.count({ where: buildSearchWhere(search) });
  },

  create(data: Prisma.FeatureCreateInput): Promise<Feature> {
    return prisma.feature.create({ data });
  },

  update(id: string, data: Prisma.FeatureUpdateInput): Promise<Feature> {
    return prisma.feature.update({ where: { id }, data });
  },

  delete(id: string): Promise<Feature> {
    return prisma.feature.delete({ where: { id } });
  },
};
