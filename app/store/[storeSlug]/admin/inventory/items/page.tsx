import { requireSsrAuth } from "@/features/auth";
import List from "@/src/interface/ui/items/components/list";
import { itemDeps } from "@/src/application/item/composition/item-deps";
import { buildGetItemsListRequest } from "@/src/application/item/composition/item-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { ItemDTO } from "@/src/application/item/dto/item.dto";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
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

	const runner = buildUsecaseRunner();
	const items: ItemDTO[] = await runner.runWithInput(
		buildGetItemsListRequest(
			{},
			buildStoreRequestContext(authContext),
			itemDeps.list,
		),
	);

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
