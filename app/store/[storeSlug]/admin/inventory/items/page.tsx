import { requireSsrAuth } from "@/features/auth";
import List from "@/src/interface/ui/items/components/list";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { getItemsListUsecase } from "@/src/application/item/usecase/get-items-list.usecase";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { getQueryClient } from "@/lib/get-query-client";
import { ITEM_QUERY_KEYS } from "@/src/interface/ui/items/constants/query-keys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type ItemPageProps = {
	params: Promise<{
		storeSlug: string;
	}>;
};

export default async function ItemsPage(props: ItemPageProps) {
	const { params } = props;
	const { storeSlug } = await params;

	const authContext = await requireSsrAuth({ storeSlug });

	const items: ItemDTO[] = await runUsecase({
		input: {},
		useCase: getItemsListUsecase,
		authContext: authContext,
	});

	const queryClient = getQueryClient();

	queryClient.setQueryData(ITEM_QUERY_KEYS.list(), items);

	return (
		<div className="h-96">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<List />
			</HydrationBoundary>
		</div>
	);
}
