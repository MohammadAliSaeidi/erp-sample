"use server";

import { requireSsrAuth } from "@/features/auth";
import { createCategoryUsecase } from "@/application/category/usecase/create-category.usecase";
import {
  ActionResult,
  actionSuccess,
  mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runUseCase } from "@/features/shared/application/run-use-case";
import { CreateCategoryInputDTO } from "../../dto/category/create-category-input.dto";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

export async function createCategoryAction(
  input: CreateCategoryInputDTO,
): Promise<ActionResult<CategoryDTO>> {
  try {
    const authContext = await requireSsrAuth();
    const createdCategory = await runUseCase({
      useCase: createCategoryUsecase,
      input,
      authContext,
    });

    return actionSuccess(createdCategory);
  } catch (error) {
    return mapOperationErrorToActionResult(error);
  }
}
