"use server";

import { createItemUsecase } from "@/src/application/item/usecase/create-item.usecase";
import {
  ActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runAuthenticatedAction } from "@/src/interface/actions/run-authenticated-action";
import { CreateItemInputDTO } from "@/src/application/item/dto/create-item-input.dto";
import { ItemDTO } from "@/src/application/item/dto/item.dto";

export async function createItemAction(
  rawInput: CreateItemInputDTO,
): Promise<ActionResult<ItemDTO>> {
  return runAuthenticatedAction({
    useCase: createItemUsecase,
    input: rawInput,
  });
}
