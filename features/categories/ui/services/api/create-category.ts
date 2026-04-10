import { CreateCategoryBody } from "@/features/categories/domain/types/create-category-body.type";
import { Category } from "@/app/generated/prisma/client";
import { ApiClient } from "@/features/shared/lib/api-client";

export const createCategory = async (
  body: CreateCategoryBody,
  apiClient: ApiClient,
) => await apiClient.post<Category>("/api/v1/inventory/category", body);
