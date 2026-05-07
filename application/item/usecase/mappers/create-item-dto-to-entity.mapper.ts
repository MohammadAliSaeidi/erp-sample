import { IMapper } from "@/application/map-dto-to-entity";
import {
  createItem,
  Item,
  ItemSpecificationAssignment,
} from "@/domain/item/item.entity";
import { CreateItemInputDTO } from "@/interface/dto/item/create-item-input.dto";
import { brand } from "@/lib/brand";

export const createItemDTOToEntityMapper: IMapper<
  CreateItemInputDTO & { id: string },
  Item
> = {
  map: (itemDTO: CreateItemInputDTO & { id: string }): Item => {
    return createItem({
      id: brand(itemDTO.id),
      name: itemDTO.name,
      number: itemDTO.number,
      description: itemDTO.description,
      price: itemDTO.price,
      categoryId: brand(itemDTO.categoryId),
      specificationAssignments: itemDTO.specificationAssignments.map(
        (assignment): ItemSpecificationAssignment => ({
          specificationId: brand(assignment.specificationId),
          specificationValueId: brand(assignment.specificationValueId),
        }),
      ),
    });
  },
};
