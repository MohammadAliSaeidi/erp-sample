import { ApiClient } from "@/lib/api-client";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { LoginInputDTO } from "../../../../src/application/auth/usecase/login-input-dto.type";
import { login } from "../services/api/login";

export const buildLoginMutationOptions = (apiClient: ApiClient) => {
	return mutationOptions({
		mutationFn: (body: LoginInputDTO) => login(body, apiClient),
	});
};

export const useLoginMutationOptions = (apiClient: ApiClient) => {
	return buildLoginMutationOptions(apiClient);
};

export const useLoginMutation = (apiClient: ApiClient) => {
	return useMutation(useLoginMutationOptions(apiClient));
};
