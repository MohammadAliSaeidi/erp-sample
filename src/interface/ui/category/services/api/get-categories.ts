import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { ApiClient } from "@/lib/api-client";

export const getCategories = (apiClient: ApiClient) => {
  return apiClient.get<CategoryDTO[]>("/api/v1/inventory/category");
};
