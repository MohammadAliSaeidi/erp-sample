import { createItem, Item } from "@/domain/item/item.entity";
import { ItemSpecificationValue as PrismaItemSpecificationValue } from "@/app/generated/prisma/client";
import {
  CategoryId,
} from "@/features/shared/domain/ids";
import { createItemId } from "@/domain/item/item-id";

export type PrismaItemWithSpecificationValues = {
  id: string;
  name: string;
  categoryId: string | null;
  storeId: string;
  number: string;
  description: string;
  price: number;
  itemSpecificationValues: PrismaItemSpecificationValue[];
};

export const mapToDomainItem = (
  item: PrismaItemWithSpecificationValues,
): Item => {
  const itemId = createItemId(item.id);
  const specificationId = createSpecific

  return createItem({
    id: itemId,
    name: item.name,
    number: item.number,
    description: item.description,
    price: item.price,
    categoryId: item.categoryId as CategoryId,
    specificationAssignments: item.itemSpecificationValues.map((value) => ({
      specificationId: value.specificationId ,
      specificationValueId: value.specificationValueId ,
    })),
  });
};
