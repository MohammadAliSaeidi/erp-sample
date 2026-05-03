import CategoryDetails from "@/interface/ui/category/components/category-details/category-details";
import { requireSsrAuth } from "@/features/auth";
import { getCategoryByIdUsecase } from "@/application/category/usecase/get-category-by-id.usecase";
import { CATEGORY_QUERY_KEYS } from "@/interface/ui/category/constants/query-keys";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CATEGORY_SPECIFICATIONS_QUERY_KEYS } from "@/interface/ui/specification/constants/query-keys";
import { getCategorySpecificationsUsecase } from "@/application/specification/usecase/get-category-specifications.usecase";

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

	const category = await runUsecase({
		useCase: getCategoryByIdUsecase,
		input: { categoryId },
		authContext,
	});

	const specifications = await runUsecase({
		useCase: getCategorySpecificationsUsecase,
		input: categoryId,
		authContext,
	});
	
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
