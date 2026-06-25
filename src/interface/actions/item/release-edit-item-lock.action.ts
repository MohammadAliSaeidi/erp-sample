"use server";

import {
  ItemLockReleaseResultDTO,
  ReleaseItemLockInputDTO,
} from "@/src/application/item/dto/item-lock.dto";
import { releaseEditItemLockUsecase } from "@/src/application/item/usecase/release-edit-item-lock.usecase";
import { ActionResult } from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runAuthenticatedAction } from "@/src/interface/actions/run-authenticated-action";

export async function releaseEditItemLockAction(
  input: ReleaseItemLockInputDTO,
): Promise<ActionResult<ItemLockReleaseResultDTO>> {
  return runAuthenticatedAction({
    useCase: releaseEditItemLockUsecase,
    input: {
      entityId: input.entityId,
      lockToken: input.lockToken,
    },
  });
}
