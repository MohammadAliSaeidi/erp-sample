import { IMapper } from "@/src/application/shared/map-dto-to-entity";
import { CreateItemInputDTO } from "@/src/application/item/dto/create-item-input.dto";
import { brand } from "@/lib/brand";
import { Item } from "@/src/domain/item/aggregates/item.aggregate";

export const createItemDTOToEntityMapper: IMapper<
  CreateItemInputDTO & { id: string },
  Item.Aggregate
> = {
  map: (itemDTO: CreateItemInputDTO & { id: string }): Item.Aggregate => {
    return Item.restore({
      id: brand(itemDTO.id),
      name: itemDTO.name,
      number: itemDTO.number,
      description: itemDTO.description,
      isDeleted: true,
      price: itemDTO.price,
      categoryId: brand(itemDTO.categoryId),
      specificationAssignments: itemDTO.specificationAssignments.map(
        (assignment): Item.ItemSpecificationAssignment => ({
          specificationId: brand(assignment.specificationId),
          specificationValueId: brand(assignment.specificationValueId),
        }),
      ),
    });
  },
};
