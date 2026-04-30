import { CategoryDTO } from "@/interface/dto/category/category.dto";
import { ApiClient } from "@/lib/api-client";

export const getCategories = (apiClient: ApiClient) => {
  return apiClient.get<CategoryDTO[]>("/api/v1/inventory/category");
};
