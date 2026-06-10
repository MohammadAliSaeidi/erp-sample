"use server";

import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { EditCategoryInputDTO } from "@/src/application/category/dto/edit-category-input.dto";
import { requireSsrAuth } from "@/features/auth";
import {
  ActionResult,
  actionSuccess,
  mapUsecaseErrorToActionResult,
} from "@/src/interface/actions/map-usecase-error-to-action-result";
import { categoryDeps } from "@/src/application/category/composition/category-deps";
import { buildUpdateCategoryRequest } from "@/src/application/category/composition/category-requests";
import { buildUsecaseRunner } from "@/src/application/core/usecase/runner/runner";
import { buildStoreRequestContext } from "@/src/interface/http/build-store-request-context";

export async function updateCategoryAction(
  rawInput: EditCategoryInputDTO,
): Promise<ActionResult<CategoryDTO>> {
  try {
    const authContext = await requireSsrAuth();
    const runner = buildUsecaseRunner();
    const updatedCategory = await runner.runWithInput(
      buildUpdateCategoryRequest(
        rawInput,
        buildStoreRequestContext(authContext),
        categoryDeps.update,
      ),
    );

    return actionSuccess(updatedCategory);
  } catch (error) {
    return mapUsecaseErrorToActionResult(error);
  }
}
