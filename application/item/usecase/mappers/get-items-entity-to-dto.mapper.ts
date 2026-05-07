import { IMapper } from "@/application/map-dto-to-entity";
import { createItem, Item } from "@/domain/item/item.entity";
import { ItemDTO } from "@/interface/dto/item/item.dto";

export const getItemsEntityToDTOMapper: IMapper<Item, ItemDTO> = {
  map: (item: Item): ItemDTO => {
    return createItem({
      id: item.id,
      name: item.name,
      number: item.number,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      specificationAssignments: item.specificationAssignments,
    });
  },
};
