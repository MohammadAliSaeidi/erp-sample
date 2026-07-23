import { ApiClient } from "@/lib/api-client";
import {
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { ITEM_QUERY_KEYS } from "../constants/query-keys";
import { getItemById } from "../service/api/get-item-by-id";

export const buildGetItemByIdQueryOptions = (
  itemId: string,
  apiClient: ApiClient,
) => {
  return queryOptions({
    queryKey: ITEM_QUERY_KEYS.detail(itemId),
    queryFn: () => getItemById(itemId, apiClient),
  });
};

export const useGetItemByIdQuery = (itemId: string, apiClient: ApiClient) => {
  return useQuery(buildGetItemByIdQueryOptions(itemId, apiClient));
};
