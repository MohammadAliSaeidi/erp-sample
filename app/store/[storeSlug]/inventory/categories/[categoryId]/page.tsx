import CategoryOverview from "@/features/categories/ui/components/category-details/category-details";
import { requireSsrAuth } from "@/features/auth";
import { buildGetCategoryByIdOperation } from "@/features/categories/application/operations/get-category-by-id.operation";
import { buildCategoryRepository } from "@/features/categories/domain/repositories/categories.repository";
import { CATEGORY_QUERY_KEYS } from "@/features/categories/ui/constants/query-keys";
import { runOperation } from "@/features/shared/application/run-operation";
import { getQueryClient } from "@/features/shared/lib/get-query-client";
import prisma from "@/features/shared/lib/prisma";
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

	const authContext = await requireSsrAuth([], { storeSlug });

	const categoryRepository = buildCategoryRepository(prisma);
	const getCategoryByIdOperation = buildGetCategoryByIdOperation({
		getByIdAndStoreId: categoryRepository.getById,
	});
	const category = await runOperation({
		operation: getCategoryByIdOperation,
		rawInput: { categoryId },
		authContext,
	});

	const queryClient = getQueryClient();
	queryClient.setQueryData(CATEGORY_QUERY_KEYS.detail(categoryId), category);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CategoryOverview categoryId={categoryId} />
		</HydrationBoundary>
	);
}
