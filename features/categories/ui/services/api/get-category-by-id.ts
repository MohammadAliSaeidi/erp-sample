import { Category } from "@/app/generated/prisma/client";
import { ApiClient } from "@/lib/api-client";

export const getCategoryById = async (
  categoryId: string,
  apiClient: ApiClient,
) => await apiClient.get<Category>(`/api/v1/inventory/category/${categoryId}`);
