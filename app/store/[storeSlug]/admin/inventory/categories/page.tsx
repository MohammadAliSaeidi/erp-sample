import { SpinnerCustom } from "@/src/presentation/components/ui/spinner";
import CategoriesList from "@/src/interface/ui/category/components/categories-list/categories-list";
import { requireSsrAuth } from "@/features/auth";
import { categoryDeps } from "@/src/application/category/composition/category-deps";
import { buildListCategoriesRequest } from "@/src/application/category/composition/category-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { CATEGORY_QUERY_KEYS } from "@/src/interface/ui/category/constants/query-keys";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Breadcrumb from "./breadcrumb";
import { URLS } from "@/constants/urls";
import Link from "next/link";
import { Button } from "@/src/presentation/components/ui/button";
import { PlusIcon } from "lucide-react";

type CategoryPageProps = {
	params: Promise<{
		storeSlug: string;
	}>;
};

export default async function CategoryPage(props: CategoryPageProps) {
	const { params } = props;
	const { storeSlug } = await params;

	const authContext = await requireSsrAuth({ storeSlug });

	const runner = buildUsecaseRunner();
	const categories = await runner.runWithoutInput(
		buildListCategoriesRequest(
			buildStoreRequestContext(authContext),
			categoryDeps.list,
		),
	);

	const queryClient = getQueryClient();
	queryClient.setQueryData(CATEGORY_QUERY_KEYS.list(), categories);

	return (
		<>
			<Breadcrumb />
			<Link
				href={URLS.STORE.ADMIN.INVENTORY.CATEGORIES.CREATE(storeSlug)}
			>
				<Button variant="default" aria-label="Create Category">
					<PlusIcon />
					Create Category
				</Button>
			</Link>
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
