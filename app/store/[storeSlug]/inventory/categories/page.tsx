import { SpinnerCustom } from "@/components/ui/spinner";
import CreateCategoryForm from "@/features/categories/ui/components/create-category-form";
import CategoriesList from "@/features/categories/ui/components/categories-list/categories-list";
import { requireSsrAuth } from "@/features/auth";
import { buildListCategoriesOperation } from "@/features/categories/application/operations/list-categories.operation";
import { buildCategoryRepository } from "@/features/categories/domain/repositories/categories.repository";
import { CATEGORY_QUERY_KEYS } from "@/features/categories/ui/constants/query-keys";
import { runOperation } from "@/features/shared/application/run-operation";
import { getQueryClient } from "@/features/shared/lib/get-query-client";
import prisma from "@/features/shared/lib/prisma";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

type CategoryPageProps = {
	params: Promise<{
		storeSlug: string;
	}>;
};

export default async function CategoryPage(props: CategoryPageProps) {
	const { params } = props;
	const { storeSlug } = await params;

	const authContext = await requireSsrAuth(['categories:read'], { storeSlug });

	const categoryRepository = buildCategoryRepository(prisma);
	const listCategoriesOperation = buildListCategoriesOperation({
		getListByStoreId: categoryRepository.getList,
	});
	
	const categories = await runOperation({
		operation: listCategoriesOperation,
		input: {},
		authContext,
	});

	const queryClient = getQueryClient();
	queryClient.setQueryData(CATEGORY_QUERY_KEYS.list(), categories);

	return (
		<>
			<CreateCategoryForm />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense
					fallback={
						<div className="flex w-full h-full items-center justify-center">
							<SpinnerCustom />
						</div>
					}
				>
					<CategoriesList />
				</Suspense>
			</HydrationBoundary>
		</>
	);
}
