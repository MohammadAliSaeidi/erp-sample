import { IMapper } from "@/application/map-dto-to-entity";
import { Specification } from "@/domain/specification/specification.aggregate";
import { SpecificationDTO } from "@/interface/dto/specification/specification.dto";

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
