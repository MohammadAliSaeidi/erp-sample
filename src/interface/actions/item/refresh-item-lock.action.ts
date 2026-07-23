"use server";

import { buildRefreshItemLockRequest } from "@/src/application/item/composition/item-lock-requests";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";

export type RefreshItemLockInput = {
  entityId: string;
  lockToken: string;
  ttlMs: number;
};

export async function refreshItemLockAction(
  rawInput: RefreshItemLockInput,
): Promise<ActionResult<{ ok: boolean }>> {
  try {
    const authContext = await requireSsrAuth();
    const runner = buildUsecaseRunner();
    const result = await runner.runWithInput(
      buildRefreshItemLockRequest(
        {
          entityId: rawInput.entityId,
          token: rawInput.lockToken,
          ttlMs: rawInput.ttlMs,
        },
        buildStoreRequestContext(authContext),
      ),
    );

    return actionSuccess(result);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
