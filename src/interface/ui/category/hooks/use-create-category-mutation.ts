import { ApiClient } from "@/lib/api-client";
import {
  mutationOptions,
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { CreateCategoryInputDTO } from "@/src/application/category/dto/create-category-input.dto";
import { CATEGORY_QUERY_KEYS } from "../constants/query-keys";
import { createCategory } from "../services/api/create-category";

export const buildCreateCategoryMutationOptions = (
  apiClient: ApiClient,
  queryClient: QueryClient,
) => {
  return mutationOptions({
    mutationFn: (body: CreateCategoryInputDTO) =>
      createCategory(body, apiClient),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CATEGORY_QUERY_KEYS.list(),
      });
    },
  });
};

export const useCreateCategoryMutationOptions = (apiClient: ApiClient) => {
  const queryClient = useQueryClient();

  return buildCreateCategoryMutationOptions(apiClient, queryClient);
};

export const useCreateCategoryMutation = (apiClient: ApiClient) => {
  return useMutation(useCreateCategoryMutationOptions(apiClient));
};
