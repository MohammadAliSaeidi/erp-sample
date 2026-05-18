import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { IMapper } from "@/src/application/shared/map-dto-to-entity";
import { Category } from "@/src/domain/category/category.entity";

export const categoryEntityToDTOMapper: IMapper<Category, CategoryDTO> = {
  map: (category: Category): CategoryDTO => {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  },
};
