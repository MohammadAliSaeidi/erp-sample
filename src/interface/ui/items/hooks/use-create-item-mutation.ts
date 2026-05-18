import { CreateItemInputDTO } from "@/src/application/item/dto/create-item-input.dto";
import { ApiClient } from "@/lib/api-client";
import {
  mutationOptions,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ITEM_QUERY_KEYS } from "../constants/query-keys";
import { createItem } from "../service/api/create-item";

export const buildCreateItemMutationOptions = (
  apiClient: ApiClient,
  queryClient: QueryClient,
) => {
  return mutationOptions({
    mutationFn: (body: CreateItemInputDTO) => createItem(body, apiClient),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ITEM_QUERY_KEYS.list(),
      });
    },
  });
};

export const useCreateItemMutationOptions = (apiClient: ApiClient) => {
  const queryClient = useQueryClient();

  return buildCreateItemMutationOptions(apiClient, queryClient);
};

export const useCreateItemMutation = (apiClient: ApiClient) => {
  return useMutation(useCreateItemMutationOptions(apiClient));
};
