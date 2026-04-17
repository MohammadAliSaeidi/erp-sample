import { ApiClient } from "@/features/shared/lib/api-client";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { LoginInput } from "../../domain/types/login-body.type";
import { login } from "../services/api/login";

export const buildLoginMutationOptions = (apiClient: ApiClient) => {
  return mutationOptions({
    mutationFn: (body: LoginInput) => login(body, apiClient),
  });
};

export const useLoginMutationOptions = (apiClient: ApiClient) => {
  return buildLoginMutationOptions(apiClient);
};

export const useLoginMutation = (apiClient: ApiClient) => {
  return useMutation(useLoginMutationOptions(apiClient));
};
