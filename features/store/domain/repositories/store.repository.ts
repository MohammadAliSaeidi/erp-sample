import { PrismaClient, Store } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export interface IStoresRepositoryPort {
  getBySlug: (storeSlug: string) => Promise<Store | null>;
}

export const buildStoresRepositoryAdapter = (prismaDB: PrismaClient) => {
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

export const storeRepositoryAdapter = buildStoresRepositoryAdapter(prisma);
