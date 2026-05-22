import {
  PrismaClient,
  Store,
} from "@/src/infrastructure/database/orm/prisma/generated/client";
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
