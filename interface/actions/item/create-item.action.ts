"use server";

import { createItemUsecase } from "@/application/item/usecase/create-item.usecase";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { CreateItemInputDTO } from "@/interface/dto/item/create-item-input.dto";
import { ItemDTO } from "@/interface/dto/item/item.dto";

export async function createItemAction(
  rawInput: CreateItemInputDTO,
): Promise<ActionResult<ItemDTO>> {
  try {
    const authContext = await requireSsrAuth();

    const createdItem: ItemDTO = await runUseCase({
      useCase: createItemUsecase,
      input: rawInput,
      authContext,
    });

    return actionSuccess({ ...createdItem });
  } catch (error) {
    return mapOperationErrorToActionResult(error);
  }
}
