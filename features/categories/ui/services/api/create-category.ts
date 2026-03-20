import { CreateCategoryBody } from "@/features/categories/domain/types/create-category-body.type";
import { CreateItemBody } from "@/features/items/types/create-item-body.type";
import { ApiClient } from "@/features/shared/lib/api-client";

export const createCategory = async (body: CreateCategoryBody, apiClient: ApiClient) =>
	await apiClient.post<CreateItemBody>("/api/v1/inventory/category", body);
