import { ApiClient } from "@/lib/api-client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ITEM_QUERY_KEYS } from "../constants/query-keys";
import { getItemsList } from "../service/api/get-items-list";

export const buildGetItemListQueryOptions = (apiClient: ApiClient) => {
  return queryOptions({
    queryFn: () => getItemsList(apiClient),
    queryKey: ITEM_QUERY_KEYS.list(),
  });
};

export const useGetItemsListQueryOptions = (apiClient: ApiClient) => {
  return buildGetItemListQueryOptions(apiClient);
};

export const useGetItemsListQuery = (apiClient: ApiClient) => {
  return useQuery(useGetItemsListQueryOptions(apiClient));
};
