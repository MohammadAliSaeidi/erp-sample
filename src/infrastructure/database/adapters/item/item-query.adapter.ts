import { PrismaClient } from "@/src/infrastructure/database/orm/prisma/generated/client";
import { IItemQueryPort } from "@/src/application/item/port/item.query.port";
import { ItemId } from "@/src/domain/item/item-id";
import { StoreId } from "@/src/domain/store/store-id";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import prisma from "@/lib/prisma";
import { itemPrismaToDTOMapper } from "./mappers/item-prisma-to-dto-mapper";
import { buildPrismaWhere } from "@/src/application/shared/query/builders/query-where.builder";
import { itemListQuery } from "@/src/application/item/schema/item-list-query.schema";
import { itemWithRelationsInclude } from "./types";

export interface IItemQueryAdapterBuilder {
  (prismaDB: PrismaClient): IItemQueryPort;
}

export const buildItemRepositoryAdapter: IItemQueryAdapterBuilder = (
  prismaDB: PrismaClient,
) => {
  return {
    getItemDTOById: async (
      itemId: ItemId,
      storeId: StoreId,
    ): Promise<ItemDTO | null> => {
      const item = await prismaDB.item.findFirst({
        where: {
          id: itemId,
          storeId,
          deletedAt: null,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          itemSpecificationValues: {
            include: {
              specification: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                  isPrimary: true,
                  isRequired: true,
                  isActive: true,
                },
              },
              specificationValue: true,
            },
          },
        },
      });

      if (!item) return null;

      return itemPrismaToDTOMapper.map(item);
    },

    getItemDTOList: async (storeId, query): Promise<ItemDTO[]> => {
      const dynamicWhere = buildPrismaWhere(
        query.filter,
        itemListQuery.filterSpec,
      );

      const items = await prismaDB.item.findMany({
        where: {
          storeId,
          ...dynamicWhere,
        },
        skip:
          ((query.pagination?.page ?? 1) - 1) * (query.pagination?.limit ?? 20),
        take: query.pagination?.limit ?? 20,
        include: itemWithRelationsInclude,
      });

      return items.map(itemPrismaToDTOMapper.map);
    },
  };
};

export const itemQueryAdapter = buildItemRepositoryAdapter(prisma);
