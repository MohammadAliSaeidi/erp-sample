import { SpinnerCustom } from "@/components/ui/spinner";
import CategoriesList from "@/features/categories/ui/components/categories-list/categories-list";
import CreateCategoryForm from "@/features/categories/ui/components/create-category-form";
import { buildGetCategoriesQueryOptions } from "@/features/categories/ui/hooks/use-get-category-query";
import { createApiClient } from "@/features/shared/lib/api-client";
import { ServerRedirectHandler } from "@/features/shared/lib/api-client/handlers/server-redirect-handler";
import { getQueryClient } from "@/features/shared/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function CategoryPage() {
	const queryClient = getQueryClient();

	const getCategoriesQueryOptions = buildGetCategoriesQueryOptions(
		createApiClient({ redirectHandler: new ServerRedirectHandler() }),
	);

	await queryClient.prefetchQuery(getCategoriesQueryOptions);

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
