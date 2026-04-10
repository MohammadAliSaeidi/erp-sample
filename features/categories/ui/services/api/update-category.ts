import { Category } from "@/app/generated/prisma/client";
import { EditCategoryBody } from "@/features/categories/domain/schemas/edit-category-body.schema";
import { ApiClient } from "@/features/shared/lib/api-client";

export const updateCategory = async (
	body: EditCategoryBody,
	apiClient: ApiClient,
) =>
	await apiClient.put<Category>(
		`/api/v1/inventory/category/${body.id}`,
		{ name: body.name },
	);
