import CategoryDetails from "@/features/categories/ui/components/category-details/category-details";
import { requireSsrAuth } from "@/features/auth";
import { getCategoryByIdUsecase } from "@/features/specifications/application/category/usecase/get-category-by-id.usecase";
import { CATEGORY_QUERY_KEYS } from "@/features/categories/ui/constants/query-keys";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type CategoryDetailsProps = {
	params: Promise<{
		storeSlug: string;
		categoryId: string;
	}>;
};

export default async function CategoryDetailsPage(props: CategoryDetailsProps) {
	const { params } = props;
	const { categoryId, storeSlug } = await params;

	const authContext = await requireSsrAuth(["categories:read-details"], {
		storeSlug,
	});

	const category = await runUseCase({
		useCase: getCategoryByIdUsecase,
		input: { categoryId },
		authContext,
	});

	const queryClient = getQueryClient();
	queryClient.setQueryData(CATEGORY_QUERY_KEYS.detail(categoryId), category);

	return (
		<>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<CategoryDetails categoryId={categoryId} />
			</HydrationBoundary>
		</>
	);
}
