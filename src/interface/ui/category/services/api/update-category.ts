import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { EditCategoryInputDTO } from "@/src/application/category/dto/edit-category-input.dto";
import { ApiClient } from "@/lib/api-client";

export const updateCategory = async (
  body: EditCategoryInputDTO,
  apiClient: ApiClient,
) =>
  await apiClient.put<CategoryDTO>(`/api/v1/inventory/category/${body.id}`, {
    name: body.name,
  });
