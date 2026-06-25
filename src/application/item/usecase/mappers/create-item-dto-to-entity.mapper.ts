import { IMapper } from "@/src/application/shared/map-dto-to-entity";
import {
  createItem,
  Item,
  ItemSpecificationAssignment,
} from "@/src/domain/item/item.entity";
import { CreateItemInputDTO } from "@/src/application/item/dto/create-item-input.dto";
import { brand } from "@/lib/brand";

export const createItemDTOToEntityMapper: IMapper<
  CreateItemInputDTO & { id: string },
  Item
> = {
  map: (itemDTO: CreateItemInputDTO & { id: string }): Item => {
    try {
      return createItem({
        id: brand(itemDTO.id),
        name: itemDTO.name,
        number: itemDTO.number,
        description: itemDTO.description,
        isDeleted: true,
        price: itemDTO.price,
        categoryId: brand(itemDTO.categoryId),
        specificationAssignments: itemDTO.specificationAssignments.map(
          (assignment): ItemSpecificationAssignment => ({
            specificationId: brand(assignment.specificationId),
            specificationValueId: brand(assignment.specificationValueId),
          }),
        ),
      });
    } catch (error) {
      console.error("Error mapping itemDTO to entity", error);
      throw error;
    }
  },
};
