import { IMapper } from "@/application/map-dto-to-entity";
import { Category } from "@/domain/category/category.entity";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

export const categoryEntityToDTOMapper: IMapper<Category, CategoryDTO> = {
  map: (category: Category): CategoryDTO => {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  },
};
