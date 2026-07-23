import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { IMapper } from "@/src/application/shared/map-dto-to-entity";
import {
  Category,
  createCategory,
} from "@/src/domain/category/category.entity";

export const createCategoryDTOToEntityMapper: IMapper<CategoryDTO, Category> = {
  map: (categoryDTO: CategoryDTO): Category => {
    return createCategory({
      id: categoryDTO.id,
      name: categoryDTO.name,
      description: categoryDTO.description ?? undefined,
    });
  },
};
