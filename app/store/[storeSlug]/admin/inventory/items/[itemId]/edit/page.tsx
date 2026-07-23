import { requireSsrAuth } from "@/features/auth";
import EditItemForm from "@/src/interface/ui/items/components/edit-item-form/edit-item-form";
import { itemDeps } from "@/src/application/item/composition/item-deps";
import { buildGetItemByIdRequest } from "@/src/application/item/composition/item-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { ITEM_QUERY_KEYS } from "@/src/interface/ui/items/constants/query-keys";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

type EditItemPageProps = {
  params: Promise<{
    storeSlug: string;
    itemId: string;
  }>;
};

export default async function EditItemPage(props: EditItemPageProps) {
  const { params } = props;
  const { itemId, storeSlug } = await params;

  const authContext = await requireSsrAuth({ storeSlug });

  const runner = buildUsecaseRunner();
  const item = await runner.runWithInput(
    buildGetItemByIdRequest(
      { itemId },
      buildStoreRequestContext(authContext),
      itemDeps.getById,
    ),
  );

  const queryClient = getQueryClient();
  queryClient.setQueryData(ITEM_QUERY_KEYS.detail(itemId), item);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditItemForm itemId={itemId} />
    </HydrationBoundary>
  );
}
