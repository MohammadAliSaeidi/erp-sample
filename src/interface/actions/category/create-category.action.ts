"use server";

import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { buildCreateCategoryRequest } from "@/src/application/category/composition/create-category-request";
import { createCategoryDeps } from "@/src/application/category/composition/create-category-deps";
import { CreateCategoryOutputDTO } from "@/src/application/category/usecase/create-category.usecase";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";
import { CreateCategoryInputDTO } from "@/src/application/category/dto/create-category-input.dto";

export async function createCategoryAction(
  input: CreateCategoryInputDTO,
): Promise<ActionResult<CategoryDTO>> {
  try {
    const authContext = await requireSsrAuth();
    const runner = buildUsecaseRunner();
    const createdCategory: CreateCategoryOutputDTO = await runner.runWithInput(
      buildCreateCategoryRequest(
        input,
        buildStoreRequestContext(authContext),
        createCategoryDeps,
      ),
    );

    return actionSuccess(createdCategory);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
