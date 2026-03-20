import { ApiClient } from "@/features/shared/lib/api-client";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { CreateCategoryBody } from "../../domain/types/create-category-body.type";
import { createCategory } from "../services/api/create-category";

export const buildCreateCategoryMutationOptions = (apiClient: ApiClient) => {
  return mutationOptions({
    mutationFn: (body: CreateCategoryBody) => createCategory(body, apiClient),
  });
};

export const useCreateCategoryMutationOptions = (apiClient: ApiClient) => {
  return buildCreateCategoryMutationOptions(apiClient);
};

export const useCreateCategoryMutation = (apiClient: ApiClient) => {
  return useMutation(useCreateCategoryMutationOptions(apiClient));
};
