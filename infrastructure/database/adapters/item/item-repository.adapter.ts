import { PrismaClient } from "@/app/generated/prisma/client";
import { ItemId } from "@/domain/item/item-id";
import { IItemRepositoryPort } from "@/domain/item/item-repository.port";
import { StoreId } from "@/domain/store/store-id";
import { itemPrismaToDomainMapper } from "./mappers/item-prisma-to-domain-mapper";
import { Item } from "@/domain/item/item.entity";
import prisma from "@/lib/prisma";

export interface IItemRepositoryAdapterBuilder {
  (prismaDB: PrismaClient): IItemRepositoryPort;
}

export const buildItemRepositoryAdapter: IItemRepositoryAdapterBuilder = (
  prismaDB: PrismaClient,
) => {
  return {
    getList: async (storeId: StoreId): Promise<Item[]> => {
      const items = await prismaDB.item.findMany({
        where: { storeId: String(storeId) },
        include: {
          itemSpecificationValues: {
            select: {
              specificationId: true,
              specificationValueId: true,
            },
          },
        },
      });

      const itemsDomain = items.map((item) =>
        itemPrismaToDomainMapper.map(item),
      );

      return itemsDomain;
    },

    getById: async (itemId: ItemId, storeId: StoreId): Promise<Item | null> => {
      const item = await prismaDB.item.findUnique({
        where: { id: String(itemId), storeId: String(storeId) },
        include: {
          itemSpecificationValues: {
            select: {
              specificationId: true,
              specificationValueId: true,
            },
          },
        },
      });

      if (!item) return null;

      const domainItem = itemPrismaToDomainMapper.map(item);

      return domainItem;
    },

    create: async (item: Item, storeId: StoreId): Promise<Item> => {
      const createdItem = await prismaDB.item.create({
        data: { ...item, storeId: String(storeId) },
        include: {
          itemSpecificationValues: {
            select: {
              specificationId: true,
              specificationValueId: true,
            },
          },
        },
      });

      return itemPrismaToDomainMapper.map(createdItem);
    },

    update: async (item: Item, storeId: StoreId) => {
      const existingItem = await prismaDB.item.findUnique({
        where: { id: String(item.id), storeId: String(storeId) },
      });

      if (!existingItem) {
        throw new Error("Item not found for store");
      }

      const updatedItem = await prismaDB.item.update({
        where: { id: String(item.id), storeId: String(storeId) },
        data: { ...item, storeId: String(storeId) },
        include: {
          itemSpecificationValues: {
            select: {
              specificationId: true,
              specificationValueId: true,
            },
          },
        },
      });

      return itemPrismaToDomainMapper.map(updatedItem);
    },
  };
};

export const itemRepositoryAdapter = buildItemRepositoryAdapter(prisma);