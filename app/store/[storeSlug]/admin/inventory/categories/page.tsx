import { SpinnerCustom } from "@/src/presentation/components/ui/spinner";
import CategoriesList from "@/src/interface/ui/category/components/categories-list/categories-list";
import { requireSsrAuth } from "@/features/auth";
import { listCategoriesUsecase } from "@/src/application/category/usecase/list-categories.usecase";
import { CATEGORY_QUERY_KEYS } from "@/src/interface/ui/category/constants/query-keys";
import { runUsecase } from "@/features/shared/application/run-use-case";
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

	const categories = await runUsecase({
		useCase: listCategoriesUsecase,
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
