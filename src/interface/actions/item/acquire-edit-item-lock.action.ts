"use server";

import {
  AcquireItemLockInputDTO,
  DEFAULT_ITEM_LOCK_TTL_MS,
  ItemLockAcquireResultDTO,
} from "@/src/application/item/dto/item-lock.dto";
import { acquireEditItemLockUsecase } from "@/src/application/item/usecase/acquire-edit-item-lock.usecase";
import { ActionResult } from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runAuthenticatedAction } from "@/src/interface/actions/run-authenticated-action";

export async function acquireEditItemLockAction(
  input: AcquireItemLockInputDTO,
): Promise<ActionResult<ItemLockAcquireResultDTO>> {
  return runAuthenticatedAction({
    useCase: acquireEditItemLockUsecase,
    input: {
      entityId: input.entityId,
      ttlMs: input.ttlMs ?? DEFAULT_ITEM_LOCK_TTL_MS,
    },
  });
}
