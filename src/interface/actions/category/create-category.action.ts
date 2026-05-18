"use server";

import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { createCategoryUsecase } from "@/src/application/category/usecase/create-category.usecase";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { CreateCategoryInputDTO } from "@/src/application/category/dto/create-category-input.dto";

export async function createCategoryAction(
  input: CreateCategoryInputDTO,
): Promise<ActionResult<CategoryDTO>> {
  try {
    const authContext = await requireSsrAuth();
    const createdCategory = await runUsecase({
      useCase: createCategoryUsecase,
      input,
      authContext,
    });

    return actionSuccess(createdCategory);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
