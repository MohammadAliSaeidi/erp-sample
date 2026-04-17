import { Category } from "@/app/generated/prisma/client";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { OperationNotFoundError } from "@/features/shared/application/errors/operation-errors";
import { defineAuthenticatedOperation } from "@/features/shared/application/operation";
import z from "zod";

const getCategoryByIdInputSchema = z.object({
	categoryId: z.uuidv7(),
});

export interface GetCategoryByIdOperationDeps {
	getByIdAndStoreId: (
		categoryId: string,
		storeId: string,
	) => Promise<Category | null>;
}

export const buildGetCategoryByIdOperation = (
	deps: GetCategoryByIdOperationDeps,
) =>
	defineAuthenticatedOperation({
		key: "categories.get-by-id",
		auth: "required",
		requiredPermissions: [PERMISSIONS.CATEGORIES.READ_DETAILS],
		inputSchema: getCategoryByIdInputSchema,
		execute: async ({ input, authContext }) => {
			const category = await deps.getByIdAndStoreId(
				input.categoryId,
				authContext.storeId,
			);
			if (!category) {
				throw new OperationNotFoundError(
					`Category ${input.categoryId} was not found`,
				);
			}

			return category;
		},
	});
