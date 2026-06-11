import CategoryDetails from "@/src/interface/ui/category/components/category-details/category-details";
import { CATEGORY_QUERY_KEYS } from "@/src/interface/ui/category/constants/query-keys";
import { categoryDeps } from "@/src/application/category/composition/category-deps";
import { buildGetCategoryByIdRequest } from "@/src/application/category/composition/category-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CATEGORY_SPECIFICATIONS_QUERY_KEYS } from "@/src/interface/ui/specification/constants/query-keys";
import { specificationDeps } from "@/src/application/specification/composition/specification-deps";
import { buildGetCategorySpecificationsRequest } from "@/src/application/specification/composition/specification-requests";
import { requireSsrAuth } from "@/features/auth";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";

type CategoryDetailsProps = {
	params: Promise<{
		storeSlug: string;
		categoryId: string;
	}>;
};

export default async function CategoryDetailsPage(props: CategoryDetailsProps) {
	const { params } = props;
	const { categoryId, storeSlug } = await params;

	const authContext = await requireSsrAuth({ storeSlug });

	const runner = buildUsecaseRunner();
	const category = await runner.runWithInput(
		buildGetCategoryByIdRequest(
			{ categoryId },
			buildStoreRequestContext(authContext),
			categoryDeps.getById,
		),
	);

	const specifications = await runner.runWithInput(
		buildGetCategorySpecificationsRequest(
			{ categoryId },
			buildStoreRequestContext(authContext),
			specificationDeps.listByCategory,
		),
	);

	const queryClient = getQueryClient();

	queryClient.setQueryData(CATEGORY_QUERY_KEYS.detail(categoryId), category);

	queryClient.setQueryData(
		CATEGORY_SPECIFICATIONS_QUERY_KEYS.list(categoryId),
		specifications,
	);

	return (
		<>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CategoryDetails categoryId={categoryId} />
			</HydrationBoundary>
		</>
	);
}
