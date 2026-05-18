import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { ApiClient } from "@/lib/api-client";

export const getCategoryById = async (
  categoryId: string,
  apiClient: ApiClient,
) =>
  await apiClient.get<CategoryDTO>(`/api/v1/inventory/category/${categoryId}`);
