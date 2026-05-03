"use server";

import { createItemUsecase } from "@/application/item/usecase/create-item.usecase";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/features/shared/adapters/action/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { CreateItemInputDTO } from "@/interface/dto/item/create-item-input.dto";
import { ItemDTO } from "@/interface/dto/item/item.dto";

export async function createItemAction(
  rawInput: CreateItemInputDTO,
): Promise<ActionResult<ItemDTO>> {
  try {
    const authContext = await requireSsrAuth();

    const createdItem: ItemDTO = await runUsecase({
      useCase: createItemUsecase,
      input: rawInput,
      authContext,
    });

    return actionSuccess({ ...createdItem });
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
