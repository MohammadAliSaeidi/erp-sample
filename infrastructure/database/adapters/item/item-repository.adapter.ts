import { Item, PrismaClient } from "@/app/generated/prisma/client";
import { ItemId } from "@/domain/item/item-id";
import { IItemRepositoryPort } from "@/domain/item/item-repository.port";
import { StoreId } from "@/features/shared/domain/ids";

export interface IItemRepositoryAdapterBuilder {
  (prismaDB: PrismaClient): IItemRepositoryPort;
}

export const buildItemRepositoryAdapter: IItemRepositoryAdapterBuilder = (
  prismaDB: PrismaClient,
) => {
  return {
    getList: async (storeId: StoreId) => {
      const items = await prismaDB.item.findMany({
        where: { storeId: String(storeId) },
      });
    },

    getById: async (itemId: ItemId, storeId: StoreId) => {
      const item = await prismaDB.item.findUnique({
        where: { id: itemId, storeId },
      });
    },

    create: async (item: Item, storeId: StoreId) => {
      const createdItem = await prismaDB.item.create({
        data: { ...item, storeId },
      });
    },

    update: async (item: Item, storeId: StoreId) => {
      const updatedItem = await prismaDB.item.update({
        where: { id: item.id, storeId },
        data: { ...item, storeId },
      });
    },
  };
};
