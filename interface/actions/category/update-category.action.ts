"use server";

import { requireSsrAuth } from "@/features/auth";
import {
	ActionResult,
	actionSuccess,
	mapUsecaseErrorToActionResult,
} from "@/features/shared/adapters/action/map-usecase-error-to-action-result";
import { runUsecase } from "@/features/shared/application/run-use-case";
import { updateCategoryUsecase } from "../../../application/category/usecase/update-category.usecase";
import { EditCategoryInputDTO } from "@/interface/dto/category/edit-category-input.dto";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

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
