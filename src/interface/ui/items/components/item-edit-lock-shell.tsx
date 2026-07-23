"use client";

import { useItemEditLock } from "@/src/interface/ui/items/hooks/use-item-edit-lock";

type ItemEditLockShellProps = {
  storeId: string;
  itemId: string;
  storeSlug: string;
  children?: React.ReactNode;
};

export function ItemEditLockShell({
  storeId,
  itemId,
  storeSlug,
  children,
}: ItemEditLockShellProps) {
  const lock = useItemEditLock({ storeId, itemId, storeSlug });

  if (lock.status === "loading") {
    return <p className="text-muted-foreground text-sm">Acquiring edit lock…</p>;
  }

  if (lock.status === "error") {
    return <p className="text-destructive text-sm">{lock.message}</p>;
  }

  if (lock.status === "locked-by-other") {
    return (
      <p className="text-muted-foreground text-sm">
        This item is being edited by {lock.lockedBy}. Try again after{" "}
        {lock.expiresAt ? new Date(lock.expiresAt).toLocaleString() : "the lock expires"}.
      </p>
    );
  }

  return <>{children ?? <p className="text-sm">You have the edit lock.</p>}</>;
}
