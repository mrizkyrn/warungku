import { type Prisma, prisma, type User } from '@/lib/db.js';

interface FindManyParams {
  skip: number;
  take: number;
  search?: string;
}

function buildSearchWhere(search?: string): Prisma.UserWhereInput {
  if (!search) return {};

  return {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ],
  };
}

export const userRepository = {
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  findMany({ skip, take, search }: FindManyParams): Promise<User[]> {
    return prisma.user.findMany({
      where: buildSearchWhere(search),
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  },

  count(search?: string): Promise<number> {
    return prisma.user.count({ where: buildSearchWhere(search) });
  },

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  },
};
