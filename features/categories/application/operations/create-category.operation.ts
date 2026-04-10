import { Category } from "@/app/generated/prisma/client";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { defineAuthenticatedOperation } from "@/features/shared/application/operation";
import z from "zod";
import { createCategoryBody } from "../../domain/schemas/create-category-body.schema";

export interface CreateCategoryOperationDeps {
	createCategory: (
		category: z.infer<typeof createCategoryBody>,
		storeId: string,
	) => Promise<Category>;
}

export const buildCreateCategoryOperation = (
	deps: CreateCategoryOperationDeps,
) =>
	defineAuthenticatedOperation({
		key: "categories.create",
		auth: "required",
		requiredPermissions: [PERMISSIONS.CATEGORIES.CREATE],
		inputSchema: createCategoryBody,
		execute: async ({ input, authContext }) => {
			return deps.createCategory(input, authContext.storeId);
		},
	});
