"use server";

import { Category } from "@/app/generated/prisma/client";
import { requireSsrAuth } from "@/features/auth";
import { buildUpdateCategoryOperation } from "@/features/categories/application/operations/update-category.operation";
import { buildCategoryRepository } from "@/features/categories/domain/repositories/categories.repository";
import {
	ActionResult,
	actionSuccess,
	mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runOperation } from "@/features/shared/application/run-operation";
import prisma from "@/features/shared/lib/prisma";

const categoryRepository = buildCategoryRepository(prisma);
const updateCategoryOperation = buildUpdateCategoryOperation({
	updateCategory: categoryRepository.update,
});

export async function updateCategoryAction(
	rawInput: unknown,
): Promise<ActionResult<Category>> {
	try {
		const authContext = await requireSsrAuth(['categories:update']);
		const updatedCategory = await runOperation({
			operation: updateCategoryOperation,
			input: rawInput,
			authContext,
		});

		return actionSuccess(updatedCategory);
	} catch (error) {
		return mapOperationErrorToActionResult(error);
	}
}
