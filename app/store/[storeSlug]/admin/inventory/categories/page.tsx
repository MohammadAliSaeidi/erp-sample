import { SpinnerCustom } from "@/components/ui/spinner";
import CategoriesList from "@/interface/ui/category/components/categories-list/categories-list";
import { requireSsrAuth } from "@/features/auth";
import { buildListCategoriesUsecase } from "@/application/category/usecase/list-categories.usecase";
import { CATEGORY_QUERY_KEYS } from "@/interface/ui/category/constants/query-keys";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import Breadcrumb from "./breadcrumb";
import { URLS } from "@/constants/urls";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";

type CategoryPageProps = {
	params: Promise<{
		storeSlug: string;
	}>;
};

export default async function CategoryPage(props: CategoryPageProps) {
	const { params } = props;
	const { storeSlug } = await params;

	const authContext = await requireSsrAuth({ storeSlug });

	const listCategoriesOperation = buildListCategoriesUsecase({
		getListByStoreId: categoryRepositoryAdapter.getList,
	});

	const categories = await runUseCase({
		useCase: listCategoriesOperation,
		input: {},
		authContext,
	});

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
