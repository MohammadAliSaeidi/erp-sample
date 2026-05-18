import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { CreateCategoryInputDTO } from "@/src/application/category/dto/create-category-input.dto";
import { ApiClient } from "@/lib/api-client";

export const createCategory = async (
  body: CreateCategoryInputDTO,
  apiClient: ApiClient,
) => await apiClient.post<CategoryDTO>("/api/v1/inventory/category", body);
