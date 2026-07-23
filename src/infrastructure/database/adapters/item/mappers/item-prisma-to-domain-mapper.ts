import { Item } from "@/src/domain/item/aggregates/item.aggregate";
import { IMapper } from "@/src/application/shared/map-dto-to-entity";
import { brand } from "@/lib/brand";
import { ItemWithRelations } from "../types";

export const itemPrismaToDomainMapper: IMapper<
  ItemWithRelations,
  Item.Aggregate
> = {
  map: (item: ItemWithRelations): Item.Aggregate => {
    return Item.factory({
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
