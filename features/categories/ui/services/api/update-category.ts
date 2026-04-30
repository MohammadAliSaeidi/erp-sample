import { Category } from "@/app/generated/prisma/client";
import { EditCategoryInputDTO } from "@/interface/schema/category/edit-category.schema";
import { ApiClient } from "@/lib/api-client";

export const updateCategory = async (
	body: EditCategoryInputDTO,
	apiClient: ApiClient,
) =>
	await apiClient.put<Category>(
		`/api/v1/inventory/category/${body.id}`,
		{ name: body.name },
	);
