import { ApiClient } from "@/features/shared/lib/api-client";

export interface CreateItemBody {
	name: string;
	categoryId: string;
}

export const createItem = async (
	apiClient: ApiClient,
	body: CreateItemBody,
) => await apiClient.post<CreateItemBody>("/api/v1/inventory/item", body);
