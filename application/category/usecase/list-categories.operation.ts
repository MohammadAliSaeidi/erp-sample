import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { Category } from "@/domain/category/category.entity";
import z from "zod";

const listCategoriesInputSchema = z.object({});

export interface ListCategoriesUsecaseDeps {
	getListByStoreId: (storeId: string) => Promise<Category[]>;
}

export const buildListCategoriesUsecase = (
	deps: ListCategoriesUsecaseDeps,
) =>
	authenticatedUsecaseFactory({
		key: "categories.list",
		auth: "required",
		requiredPermissions: [PERMISSIONS.CATEGORIES.READ],
		inputSchema: listCategoriesInputSchema,
		execute: async ({ authContext }) => {
			return deps.getListByStoreId(authContext.storeId);
		},
	});
