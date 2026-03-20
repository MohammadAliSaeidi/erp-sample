import { PrismaClient, Store } from "@/app/generated/prisma/client";

export interface IStoresRepository {
  getBySlug: (storeSlug: string) => Promise<Store | null>;
}

export interface IStoresRepositoryBuilder {
  (prismaDB: PrismaClient): IStoresRepository;
}

export const buildStoresRepository: IStoresRepositoryBuilder = (
  prismaDB: PrismaClient,
) => {
  return {
    getBySlug: async (storeSlug: string) => {
      const store = await prismaDB.store.findUnique({
        where: {
          slug: storeSlug,
        },
      });

      return store;
    },
  };
};
