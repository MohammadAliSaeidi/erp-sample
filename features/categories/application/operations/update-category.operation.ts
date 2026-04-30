import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { CategoryNotFoundForStoreError } from "@/features/specifications/domain/category/errors/category-not-found-for-store.error";
import { UseCaseNotFoundError } from "@/features/shared/application/errors/use-case-errors";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { editCategorySchema } from "../../../specifications/interface/schema/category/edit-category.schema";
import { EditCategoryInputDTO } from "@/features/specifications/interface/dto/category/edit-category-input.dto";
import { CategoryDTO } from "@/features/specifications/interface/dto/category/category.dto";
import { categoryRepositoryAdapter } from "@/features/specifications/infrastructure/database/adapters/category/category-repository.adapter";

export interface UpdateCategoryOperationDeps {
  updateCategory: (
    input: EditCategoryInputDTO,
    storeId: string,
  ) => Promise<CategoryDTO>;
}

export const buildUpdateCategoryUsecase = (deps: UpdateCategoryOperationDeps) =>
  authenticatedUsecaseFactory({
    key: "categories.update",
    auth: "required",
    requiredPermissions: [PERMISSIONS.CATEGORIES.UPDATE],
    inputSchema: editCategorySchema,
    execute: async ({ input, authContext }) => {
      try {
        return await deps.updateCategory(input, authContext.storeId);
      } catch (error) {
        if (error instanceof CategoryNotFoundForStoreError) {
          throw new UseCaseNotFoundError(error.message);
        }

        throw error;
      }
    },
  });

export const updateCategoryUsecase = buildUpdateCategoryUsecase({
  updateCategory: categoryRepositoryAdapter.update,
});
