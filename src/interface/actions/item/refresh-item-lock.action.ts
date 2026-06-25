"use server";

import {
  DEFAULT_ITEM_LOCK_TTL_MS,
  ItemLockRefreshResultDTO,
  RefreshItemLockInputDTO,
} from "@/src/application/item/dto/item-lock.dto";
import { itemLockDeps } from "@/src/application/item/composition/item-lock-deps";
import { buildRefreshItemLockRequest } from "@/src/application/item/composition/item-lock-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";

export async function refreshItemLockAction(
  input: RefreshItemLockInputDTO,
): Promise<ActionResult<ItemLockRefreshResultDTO>> {
  try {
    const authContext = await requireSsrAuth();
    const runner = buildUsecaseRunner();
    const result = await runner.runWithInput(
      buildRefreshItemLockRequest(
        {
          entityId: input.entityId,
          token: input.lockToken,
          ttlMs: input.ttlMs ?? DEFAULT_ITEM_LOCK_TTL_MS,
        },
        buildStoreRequestContext(authContext),
      ),
    );

    return actionSuccess(result);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
