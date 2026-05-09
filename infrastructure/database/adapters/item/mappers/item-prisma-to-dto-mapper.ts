import { IMapper } from "@/application/map-dto-to-entity";
import { ItemWithRelations } from "../types";
import { ItemDTO } from "@/interface/dto/item/item.dto";
import { mapToDomainType } from "../../specification/mappers/map-to-domain-type.mapper";

export const itemPrismaToDTOMapper: IMapper<ItemWithRelations, ItemDTO> = {
  map: (item: ItemWithRelations): ItemDTO => ({
    id: item.id,
    number: item.number,
    name: item.name,
    price: item.price,
    description: item.description ?? undefined,
    isDeleted: item.deletedAt === null,
    categoryId: item.category?.id,
    categoryName: item.category?.name,
    specificationAssignments: item.itemSpecificationValues.map(
      (assignment) => ({
        specification: {
          id: assignment.specification.id,
          name: assignment.specification.name,
          isPrimary: assignment.specification.isPrimary,
          isRequired: assignment.specification.isRequired,
          isActive: assignment.specification.isActive,
          type: mapToDomainType(assignment.specification.type),
        },
        specificationValue: assignment.specificationValue,
      }),
    ),
  }),
};
