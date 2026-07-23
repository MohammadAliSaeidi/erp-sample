"use server";

import { createItemDeps } from "@/src/application/item/composition/create-item-deps";
import { buildCreateItemRequest } from "@/src/application/item/composition/create-item-request";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { CreateItemInputDTO } from "@/src/application/item/dto/create-item-input.dto";
import { ItemDTO } from "@/src/application/item/dto/item.dto";

export async function createItemAction(
  rawInput: CreateItemInputDTO,
): Promise<ActionResult<ItemDTO>> {
  try {
    const authContext = await requireSsrAuth();

    const runner = buildUsecaseRunner();
    const createdItem = await runner.runWithInput(
      buildCreateItemRequest(
        rawInput,
        buildStoreRequestContext(authContext),
        createItemDeps,
      ),
    );

    if(createdItem === null) {
      return (new Error("Failed to create item"));
    }

    return actionSuccess({ ...createdItem });
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
