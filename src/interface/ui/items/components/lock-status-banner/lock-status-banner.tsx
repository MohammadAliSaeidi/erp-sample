"use client";

import { ItemLockState } from "../../hooks/use-item-edit-lock";

type LockStatusBannerProps = {
  lockState: ItemLockState;
};

export default function LockStatusBanner({ lockState }: LockStatusBannerProps) {
  if (lockState.status === "acquiring" || lockState.status === "idle") {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Acquiring edit lock...
      </div>
    );
  }

  if (lockState.status === "blocked") {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        This item is being edited by another user. Editing is read-only until
        they finish.
      </div>
    );
  }

  if (lockState.status === "error") {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
        {lockState.message}
      </div>
    );
  }

  if (lockState.status === "locked") {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
        You have the edit lock. Changes will be saved while you are editing.
      </div>
    );
  }

  return null;
}
