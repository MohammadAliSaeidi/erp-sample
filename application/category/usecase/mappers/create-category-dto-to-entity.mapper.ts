import { IMapper } from "@/application/map-dto-to-entity";
import { Category, createCategory } from "@/domain/category/category.entity";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

export const createCategoryDTOToEntityMapper: IMapper<
  CategoryDTO,
  Category
> = {
  map: (categoryDTO: CategoryDTO): Category => {
    return createCategory({
      id: categoryDTO.id,
      name: categoryDTO.name,
      description: categoryDTO.description,
    });
  },
};
