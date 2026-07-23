"use server";

import { buildAcquireEditItemLockRequest } from "@/src/application/item/composition/item-lock-requests";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import type { LockResult } from "@/src/application/shared/lock-service/lock-service.types";

export type AcquireItemLockInput = {
  entityId: string;
  ttlMs: number;
};

export async function acquireItemLockAction(
  rawInput: AcquireItemLockInput,
): Promise<ActionResult<LockResult>> {
  try {
    const authContext = await requireSsrAuth();
    const runner = buildUsecaseRunner();
    const result = await runner.runWithInput(
      buildAcquireEditItemLockRequest(
        rawInput,
        buildStoreRequestContext(authContext),
      ),
    );

    return actionSuccess(result);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
