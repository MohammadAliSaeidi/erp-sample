import { IMapper } from "@/src/application/shared/map-dto-to-entity";
import { Specification } from "@/src/domain/specification/specification.aggregate";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";

export const getSpecificationsEntityToDtoMapper: IMapper<
  Specification,
  SpecificationDTO
> = {
  map: (specification: Specification): SpecificationDTO => {
    return {
      id: specification.id,
      categoryId: specification.categoryId,
      isActive: specification.isActive,
      isPrimary: specification.isPrimary,
      isRequired: specification.isRequired,
      name: specification.name,
      specificationValues: specification.specificationValues,
      storeId: specification.storeId,
      type: specification.type,
    };
  },
};
