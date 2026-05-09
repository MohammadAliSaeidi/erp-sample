import { createItem, Item } from "@/domain/item/item.entity";
import { IMapper } from "@/application/map-dto-to-entity";
import { brand } from "@/lib/brand";
import { ItemWithRelations } from "../types";

export const itemPrismaToDomainMapper: IMapper<ItemWithRelations, Item> = {
  map: (item: ItemWithRelations): Item => {
    return createItem({
      id: brand(item.id),
      name: item.name,
      isDeleted: item.deletedAt === null,
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
