import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import {
  buildAcquireLockRequest,
  buildRefreshLockRequest,
  buildReleaseLockRequest,
} from "@/src/application/shared/lock-service/composition/lock-requests";
import type { BaseContext } from "@/src/application/core/usecase/types/context.types";
import { itemLockDeps } from "./item-lock-deps";

const ITEM_UPDATE_PERMISSIONS = [PERMISSIONS.ITEMS.UPDATE] as const;

export function buildAcquireEditItemLockRequest(
  input: unknown,
  context: BaseContext,
) {
  return buildAcquireLockRequest(
    input,
    context,
    itemLockDeps.acquire,
    ITEM_UPDATE_PERMISSIONS,
  );
}

export function buildRefreshItemLockRequest(
  input: unknown,
  context: BaseContext,
) {
  return buildRefreshLockRequest(
    input,
    context,
    itemLockDeps.refresh,
    ITEM_UPDATE_PERMISSIONS,
  );
}

export function buildReleaseEditItemLockRequest(
  input: unknown,
  context: BaseContext,
) {
  return buildReleaseLockRequest(
    input,
    context,
    itemLockDeps.release,
    ITEM_UPDATE_PERMISSIONS,
  );
}
