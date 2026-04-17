"use server";

import { Category } from "@/app/generated/prisma/client";
import { requireSsrAuth } from "@/features/auth";
import { buildCreateCategoryOperation } from "@/features/categories/application/operations/create-category.operation";
import { buildCategoryRepository } from "@/features/categories/domain/repositories/categories.repository";
import {
	ActionResult,
	actionSuccess,
	mapOperationErrorToActionResult,
} from "@/features/shared/adapters/action/map-operation-error-to-action-result";
import { runOperation } from "@/features/shared/application/run-operation";
import prisma from "@/features/shared/lib/prisma";

const categoryRepository = buildCategoryRepository(prisma);
const createCategoryOperation = buildCreateCategoryOperation({
	createCategory: categoryRepository.create,
});

export async function createCategoryAction(
	rawInput: unknown,
): Promise<ActionResult<Category>> {
	try {
		const authContext = await requireSsrAuth(['categories:create']);
		const createdCategory = await runOperation({
			operation: createCategoryOperation,
			input: rawInput,
			authContext,
		});

		return actionSuccess(createdCategory);
	} catch (error) {
		return mapOperationErrorToActionResult(error);
	}
}
