import { Category } from "@/app/generated/prisma/client";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { defineAuthenticatedOperation } from "@/features/shared/application/operation";
import z from "zod";

const listCategoriesInputSchema = z.object({});

export interface ListCategoriesOperationDeps {
	getListByStoreId: (storeId: string) => Promise<Category[]>;
}

export const buildListCategoriesOperation = (
	deps: ListCategoriesOperationDeps,
) =>
	defineAuthenticatedOperation({
		key: "categories.list",
		auth: "required",
		requiredPermissions: [PERMISSIONS.CATEGORIES.READ],
		inputSchema: listCategoriesInputSchema,
		execute: async ({ authContext }) => {
			return deps.getListByStoreId(authContext.storeId);
		},
	});
