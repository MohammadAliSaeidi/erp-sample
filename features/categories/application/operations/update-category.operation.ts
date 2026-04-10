import { Category } from "@/app/generated/prisma/client";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { CategoryNotFoundForStoreError } from "@/features/categories/domain/errors/category-not-found-for-store.error";
import { OperationNotFoundError } from "@/features/shared/application/errors/operation-errors";
import { defineAuthenticatedOperation } from "@/features/shared/application/operation";
import z from "zod";
import { editCategoryBody } from "../../domain/schemas/edit-category-body.schema";

export interface UpdateCategoryOperationDeps {
	updateCategory: (
		input: z.infer<typeof editCategoryBody>,
		storeId: string,
	) => Promise<Category>;
}

export const buildUpdateCategoryOperation = (
	deps: UpdateCategoryOperationDeps,
) =>
	defineAuthenticatedOperation({
		key: "categories.update",
		auth: "required",
		requiredPermissions: [PERMISSIONS.CATEGORIES.UPDATE],
		inputSchema: editCategoryBody,
		execute: async ({ input, authContext }) => {
			try {
				return await deps.updateCategory(input, authContext.storeId);
			} catch (error) {
				if (error instanceof CategoryNotFoundForStoreError) {
					throw new OperationNotFoundError(error.message);
				}

				throw error;
			}
		},
	});
