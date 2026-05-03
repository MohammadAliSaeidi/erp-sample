import { createItem, Item } from "@/domain/item/item.entity";
import { ItemSpecificationValue as PrismaItemSpecificationValue } from "@/app/generated/prisma/client";
import { IMapper } from "@/application/map-dto-to-entity";
import { brand } from "@/lib/brand";

export type PrismaItemWithSpecificationValues = {
  id: string;
  name: string;
  categoryId: string | null;
  storeId: string;
  number: string;
  description: string | null;
  price: number;
  itemSpecificationValues: Pick<
    PrismaItemSpecificationValue,
    "specificationId" | "specificationValueId"
  >[];
};

export const itemPrismaToDomainMapper: IMapper<
  PrismaItemWithSpecificationValues,
  Item
> = {
  map: (item: PrismaItemWithSpecificationValues): Item => {
    return createItem({
      id: brand(item.id),
      name: item.name,
      number: item.number,
      description: item.description ?? undefined,
      price: item.price,
      categoryId: brand(item.categoryId),
      specificationAssignments: item.itemSpecificationValues.map((value) => ({
        specificationId: brand(value.specificationId),
        specificationValueId: brand(value.specificationValueId),
      })),
    });
  },
};
