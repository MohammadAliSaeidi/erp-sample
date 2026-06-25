"use server";

import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { CreateCategoryInputDTO } from "@/src/application/category/dto/create-category-input.dto";
import { createCategoryUsecase } from "@/src/application/category/usecase/create-category.usecase";
import { ActionResult } from "@/src/interface/actions/map-usecase-error-to-action-result";
import { runAuthenticatedAction } from "@/src/interface/actions/run-authenticated-action";

export async function createCategoryAction(
  input: CreateCategoryInputDTO,
): Promise<ActionResult<CategoryDTO>> {
  return runAuthenticatedAction({
    useCase: createCategoryUsecase,
    input,
  });
}
