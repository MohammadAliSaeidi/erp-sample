"use server";

import { requireSsrAuth } from "@/features/auth";
import { createCategoryUsecase } from "@/features/categories/application/operations/create-category.operation";
import {
  ActionResult,
  actionSuccess,
  mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { CreateCategoryInputDTO } from "../domain/types/create-category-input.dto";
import { CategoryDTO } from "@/features/specifications/interface/dto/category/category.dto";

export async function createCategoryAction(
  rawInput: CreateCategoryInputDTO,
): Promise<ActionResult<CategoryDTO>> {
  try {
    const authContext = await requireSsrAuth(["categories:create"]);
    const createdCategory = await runUseCase({
      useCase: createCategoryUsecase,
      input: rawInput,
      authContext,
    });

    return actionSuccess(createdCategory);
  } catch (error) {
    return mapOperationErrorToActionResult(error);
  }
}
