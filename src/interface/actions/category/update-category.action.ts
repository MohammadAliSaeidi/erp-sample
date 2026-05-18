"use server";

import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { EditCategoryInputDTO } from "@/src/application/category/dto/edit-category-input.dto";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { updateCategoryUsecase } from "@/src/application/category/usecase/update-category.usecase";

export async function updateCategoryAction(
  rawInput: EditCategoryInputDTO,
): Promise<ActionResult<CategoryDTO>> {
  try {
    const authContext = await requireSsrAuth();
    const updatedCategory = await runUsecase({
      useCase: updateCategoryUsecase,
      input: rawInput,
      authContext,
    });

    return actionSuccess(updatedCategory);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
