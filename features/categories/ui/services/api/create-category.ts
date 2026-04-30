import { CreateCategoryInputDTO } from "@/features/categories/domain/types/create-category-input.dto";
import { Category } from "@/app/generated/prisma/client";
import { ApiClient } from "@/lib/api-client";

export const createCategory = async (
  body: CreateCategoryInputDTO,
  apiClient: ApiClient,
) => await apiClient.post<Category>("/api/v1/inventory/category", body);
