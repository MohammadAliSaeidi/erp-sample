import { CreateCategoryInputDTO } from "@/interface/dto/category/create-category-input.dto";
import { ApiClient } from "@/lib/api-client";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

export const createCategory = async (
  body: CreateCategoryInputDTO,
  apiClient: ApiClient,
) => await apiClient.post<CategoryDTO>("/api/v1/inventory/category", body);
