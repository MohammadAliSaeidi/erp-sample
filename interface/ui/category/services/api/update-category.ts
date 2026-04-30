import { CategoryDTO } from "@/interface/dto/category/category.dto";
import { EditCategoryInputDTO } from "@/interface/dto/category/edit-category-input.dto";
import { ApiClient } from "@/lib/api-client";

export const updateCategory = async (
	body: EditCategoryInputDTO,
	apiClient: ApiClient,
) =>
	await apiClient.put<CategoryDTO>(
		`/api/v1/inventory/category/${body.id}`,
		{ name: body.name },
	);
