import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { Category } from "@/features/specifications/domain/category/category.entity";
import z from "zod";

const listCategoriesInputSchema = z.object({});

export interface ListCategoriesUseCaseDeps {
	getListByStoreId: (storeId: string) => Promise<Category[]>;
}

export const makeListCategoriesUseCase = (
	deps: ListCategoriesUseCaseDeps,
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
