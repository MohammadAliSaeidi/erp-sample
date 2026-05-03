"use server";

import { requireSsrAuth } from "@/features/auth";
import { createCategoryUsecase } from "@/application/category/usecase/create-category.usecase";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/features/shared/adapters/action/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { CreateCategoryInputDTO } from "../../dto/category/create-category-input.dto";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

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
