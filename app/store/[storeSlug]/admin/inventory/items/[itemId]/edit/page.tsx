import { requireSsrAuth } from "@/features/auth";
import { ItemEditLockShell } from "@/src/interface/ui/items/components/item-edit-lock-shell";

type ItemEditPageProps = {
  params: Promise<{
    storeSlug: string;
    itemId: string;
  }>;
};

export default async function ItemEditPage(props: ItemEditPageProps) {
  const { storeSlug, itemId } = await props.params;
  const authContext = await requireSsrAuth({ storeSlug });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">Edit item</h1>
      <ItemEditLockShell
        storeId={String(authContext.storeId)}
        itemId={itemId}
        storeSlug={storeSlug}
      />
    </div>
  );
}
