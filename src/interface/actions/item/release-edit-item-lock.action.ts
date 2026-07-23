"use server";

import {
  ItemLockReleaseResultDTO,
  ReleaseItemLockInputDTO,
} from "@/src/application/item/dto/item-lock.dto";
import { buildReleaseEditItemLockRequest } from "@/src/application/item/composition/item-lock-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";

export async function releaseEditItemLockAction(
  input: ReleaseItemLockInputDTO,
): Promise<ActionResult<ItemLockReleaseResultDTO>> {
  try {
    const authContext = await requireSsrAuth();
    const runner = buildUsecaseRunner();
    const result = await runner.runWithInput(
      buildReleaseEditItemLockRequest(
        {
          entityId: input.entityId,
          lockToken: input.lockToken,
        },
        buildStoreRequestContext(authContext),
      ),
    );

    return actionSuccess(result);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
