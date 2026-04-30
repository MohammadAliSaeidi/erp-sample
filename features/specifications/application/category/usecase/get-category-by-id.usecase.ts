import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { UseCaseNotFoundError } from "@/features/shared/application/errors/use-case-errors";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { Category } from "@/features/specifications/domain/category/category.entity";
import { categoryRepositoryAdapter } from "@/features/specifications/infrastructure/database/adapters/category/category-repository.adapter";
import z from "zod";

const getCategoryByIdInputSchema = z.object({
  categoryId: z.uuidv7(),
});

export interface GetCategoryByIdUsecaseDeps {
  getByIdAndStoreId: (
    categoryId: string,
    storeId: string,
  ) => Promise<Category | null>;
}

export const buildGetCategoryByIdUsecase = (deps: GetCategoryByIdUsecaseDeps) =>
  authenticatedUsecaseFactory({
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
        throw new UseCaseNotFoundError(
          `Category ${input.categoryId} was not found`,
        );
      }

      return category;
    },
  });

export const getCategoryByIdUsecase = buildGetCategoryByIdUsecase({
  getByIdAndStoreId: categoryRepositoryAdapter.getById,
});
