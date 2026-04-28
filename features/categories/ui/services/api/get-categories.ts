import { Category } from "@/app/generated/prisma/client";
import { ApiClient } from "@/lib/api-client";

export const getCategories = (apiClient: ApiClient) => {
  return apiClient.get<Category[]>("/api/v1/inventory/category");
};
