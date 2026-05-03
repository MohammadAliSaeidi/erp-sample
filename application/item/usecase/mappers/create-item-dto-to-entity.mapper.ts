import { IMapper } from "@/application/map-dto-to-entity";
import { createItem, Item } from "@/domain/item/item.entity";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import { brand } from "@/lib/brand";

export const createItemDTOToEntityMapper: IMapper<ItemDTO, Item> = {
  map: (itemDTO: ItemDTO): Item => {
    return createItem({
      id: brand(itemDTO.id),
      name: itemDTO.name,
      number: itemDTO.number,
      description: itemDTO.description,
      price: itemDTO.price,
      categoryId: itemDTO.categoryId,
      specificationAssignments: itemDTO.specificationAssignments,
    });
  },
};
