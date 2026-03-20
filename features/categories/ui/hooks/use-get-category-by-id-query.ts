import { ApiClient } from "@/features/shared/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEYS } from "../constants/query-keys";
import { getCategoryById } from "../services/api/get-category-by-id";

export const buildGetCategoryByIdQueryOptions = (
	categoryId: string,
	apiClient: ApiClient,
) => {
	return queryOptions({
		queryFn: () => getCategoryById(categoryId, apiClient),
		queryKey: CATEGORY_QUERY_KEYS.detail(categoryId),
	});
};

export const useGetCategoryByIdQueryOptions = (
	categoryId: string,
	apiClient: ApiClient,
) => {
	return buildGetCategoryByIdQueryOptions(categoryId, apiClient);
};

export const useGetCategoryByIdQuery = (
	categoryId: string,
	apiClient: ApiClient,
) => {
	return useQuery(useGetCategoryByIdQueryOptions(categoryId, apiClient));
};
