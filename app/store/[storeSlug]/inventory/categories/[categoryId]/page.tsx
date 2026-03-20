import { buildGetCategoryByIdQueryOptions } from "@/features/categories/ui/hooks/use-get-category-by-id-query";
import { createApiClient } from "@/features/shared/lib/api-client";
import { ServerRedirectHandler } from "@/features/shared/lib/api-client/handlers/server-redirect-handler";
import { getQueryClient } from "@/features/shared/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type CategoryDetailsProps = {
	params: {
		categoryId: string;
	};
};

export default async function CategoryDetails(props: CategoryDetailsProps) {
	const {
		params: { categoryId },
	} = props;

	const queryClient = getQueryClient();

	const apiClient = createApiClient({
		redirectHandler: new ServerRedirectHandler(),
	});

	queryClient.prefetchQuery(
		buildGetCategoryByIdQueryOptions(categoryId, apiClient),
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}></HydrationBoundary>
	);
}
