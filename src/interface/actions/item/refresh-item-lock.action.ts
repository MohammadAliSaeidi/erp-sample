"use server";

import {
  DEFAULT_ITEM_LOCK_TTL_MS,
  ItemLockRefreshResultDTO,
  RefreshItemLockInputDTO,
} from "@/src/application/item/dto/item-lock.dto";
import { refreshItemLockUsecase } from "@/src/application/item/usecase/refresh-item-lock.usecase";
import { ActionResult } from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runAuthenticatedAction } from "@/src/interface/actions/run-authenticated-action";

export async function refreshItemLockAction(
  input: RefreshItemLockInputDTO,
): Promise<ActionResult<ItemLockRefreshResultDTO>> {
  return runAuthenticatedAction({
    useCase: refreshItemLockUsecase,
    input: {
      entityId: input.entityId,
      token: input.lockToken,
      ttlMs: input.ttlMs ?? DEFAULT_ITEM_LOCK_TTL_MS,
    },
  });
}
