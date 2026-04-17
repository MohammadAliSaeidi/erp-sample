import { ApiClient } from "@/features/shared/lib/api-client";
import { mutationOptions, QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryBody } from "../../domain/types/create-category-body.type";
import { createCategory } from "../services/api/create-category";
import { CATEGORY_QUERY_KEYS } from "../constants/query-keys";

export const buildCreateCategoryMutationOptions = (apiClient: ApiClient, queryClient: QueryClient) => {
  return mutationOptions({
    mutationFn: (body: CreateCategoryBody) => createCategory(body, apiClient),
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
