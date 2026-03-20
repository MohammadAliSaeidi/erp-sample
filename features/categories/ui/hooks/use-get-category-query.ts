import { ApiClient } from "@/features/shared/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEYS } from "../constants/query-keys";
import { getCategories } from "../services/api/get-categories";

export const buildGetCategoriesQueryOptions = (apiClient: ApiClient) => {
  return queryOptions({
    queryFn: () => getCategories(apiClient),
    queryKey: CATEGORY_QUERY_KEYS.list(),
  });
};

export const useGetCategoriesQueryOptions = (apiClient: ApiClient) => {
  return buildGetCategoriesQueryOptions(apiClient);
};

export const useGetCategoriesQuery = (apiClient: ApiClient) => {
  return useQuery(useGetCategoriesQueryOptions(apiClient));
};
