import { mutationOptions, useMutation } from "@tanstack/react-query";
import { login } from "../_services/api/login";

export const buildLoginMutationOptions = () => {
	return mutationOptions({
		mutationFn: login,
	});
};

export const useLoginMutationOptions = () => {
	return buildLoginMutationOptions();
};

export const useLoginMutation = () => {
	return useMutation(useLoginMutationOptions());
};
