import { PrismaClient } from "@/app/generated/prisma/client";
import { IItemQueryPort } from "@/application/item/port/item.query.port";
import { ItemId } from "@/domain/item/item-id";
import { StoreId } from "@/domain/store/store-id";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import prisma from "@/lib/prisma";
import { itemPrismaToDTOMapper } from "./mappers/item-prisma-to-dto-mapper";
import { buildPrismaWhere } from "@/application/shared/query/builders/query-where.builder";
import { itemListQuery } from "@/application/item/schema/item-list-query.schema";
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
