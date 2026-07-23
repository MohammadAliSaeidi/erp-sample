import { EditItemInputDTO } from "@/src/application/item/usecase/edit-item.usecase";
import { ApiClient } from "@/lib/api-client";
import {
  mutationOptions,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ITEM_QUERY_KEYS } from "../constants/query-keys";
import { updateItem } from "../service/api/update-item";

export const buildEditItemMutationOptions = ({
  queryClient,
  apiClient,
}: {
  queryClient: QueryClient;
  apiClient: ApiClient;
}) => {
  return mutationOptions({
    mutationFn: (body: EditItemInputDTO) => updateItem(body, apiClient),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ITEM_QUERY_KEYS.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: ITEM_QUERY_KEYS.list(),
      });
    },
  });
};

export const useEditItemMutationOptions = (apiClient: ApiClient) => {
  const queryClient = useQueryClient();
  return buildEditItemMutationOptions({ queryClient, apiClient });
};

export const useEditItemMutation = (apiClient: ApiClient) => {
  return useMutation(useEditItemMutationOptions(apiClient));
};
