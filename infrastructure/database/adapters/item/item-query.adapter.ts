import { PrismaClient } from "@/app/generated/prisma/client";
import { IItemQueryPort } from "@/application/item/port/item.query.port";
import { ItemId } from "@/domain/item/item-id";
import { StoreId } from "@/domain/store/store-id";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import { mapToDomainType } from "../specification/mappers/map-to-domain-type.mapper";
import prisma from "@/lib/prisma";

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

      return {
        ...item,
        description: item.description ?? undefined,
        categoryId: item.categoryId ?? undefined,
        specificationAssignments: item.itemSpecificationValues.map(
          (assignment) => ({
            specification: {
              ...assignment.specification,
              type: mapToDomainType(assignment.specification.type),
            },
            specificationValue: assignment.specificationValue,
          }),
        ),
      };
    },
  };
};

export const itemQueryAdapter = buildItemRepositoryAdapter(prisma);
