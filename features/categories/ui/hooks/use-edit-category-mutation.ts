import { ApiClient } from "@/features/shared/lib/api-client";
import {
	mutationOptions,
	QueryClient,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { EditCategoryBody } from "../../domain/schemas/edit-category-body.schema";
import { CATEGORY_QUERY_KEYS } from "../constants/query-keys";
import { createCategory } from "../services/api/create-category";

export const buildEditCategoryMutationOptions = ({
	queryClient,
	apiClient,
}: {
	queryClient: QueryClient;
	apiClient: ApiClient;
}) => {
	return mutationOptions({
		mutationFn: (body: EditCategoryBody) =>
			createCategory(body, apiClient),
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
