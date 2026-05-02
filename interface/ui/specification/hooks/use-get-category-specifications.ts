import { ApiClient } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { CATEGORY_SPECIFICATIONS_QUERY_KEYS } from "../constants/query-keys";
import { getCategorySpecifications } from "../services/api/get-category-specifications";

export const buildGetCategorySpecificationsQueryOptions = (
  categoryId: string,
  apiClient: ApiClient,
) => {
  return queryOptions({
    queryFn: () => getCategorySpecifications(apiClient, categoryId),
    queryKey: CATEGORY_SPECIFICATIONS_QUERY_KEYS.list(categoryId),
  });
};

export const useGetCategorySpecificationsQueryOptions = (
  categoryId: string,
  apiClient: ApiClient,
) => {
  return buildGetCategorySpecificationsQueryOptions(categoryId, apiClient);
};

export const useGetCategorySpecificationsQuery = (
  categoryId: string,
  apiClient: ApiClient,
) => {
  return useQuery(
    useGetCategorySpecificationsQueryOptions(categoryId, apiClient),
  );
};
