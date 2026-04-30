import { ApiClient } from "@/lib/api-client";
import {
  mutationOptions,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { EditCategoryInputDTO } from "../../../specifications/interface/schema/category/edit-category.schema";
import { CATEGORY_QUERY_KEYS } from "../constants/query-keys";
import { updateCategory } from "../services/api/update-category";

export const buildEditCategoryMutationOptions = ({
  queryClient,
  apiClient,
}: {
  queryClient: QueryClient;
  apiClient: ApiClient;
}) => {
  return mutationOptions({
    mutationFn: (body: EditCategoryInputDTO) => updateCategory(body, apiClient),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.list(),
      });
    },
  });
};

export const useEditCategoryMutationOptions = (apiClient: ApiClient) => {
  const queryClient = useQueryClient();

  return buildEditCategoryMutationOptions({ queryClient, apiClient });
};

export const useEditCategoryMutation = (apiClient: ApiClient) => {
  return useMutation(useEditCategoryMutationOptions(apiClient));
};
