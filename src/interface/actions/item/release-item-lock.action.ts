"use server";

import { buildReleaseEditItemLockRequest } from "@/src/application/item/composition/item-lock-requests";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import type { UnlockResult } from "@/src/application/shared/lock-service/lock-service.types";

export type ReleaseItemLockInput = {
  entityId: string;
  lockToken: string;
};

export async function releaseItemLockAction(
  rawInput: ReleaseItemLockInput,
): Promise<ActionResult<UnlockResult>> {
  try {
    const authContext = await requireSsrAuth();
    const runner = buildUsecaseRunner();
    const result = await runner.runWithInput(
      buildReleaseEditItemLockRequest(
        rawInput,
        buildStoreRequestContext(authContext),
      ),
    );

    return actionSuccess(result);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
