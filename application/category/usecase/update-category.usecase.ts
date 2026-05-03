import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { CategoryNotFoundForStoreError } from "@/domain/category/errors/category-not-found-for-store.error";
import { UseCaseNotFoundError } from "@/features/shared/application/errors/use-case-errors";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import { editCategorySchema } from "../../../interface/schema/category/edit-category.schema";
import { EditCategoryInputDTO } from "@/interface/dto/category/edit-category-input.dto";
import { CategoryDTO } from "@/interface/dto/category/category.dto";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";
import { createCategoryDTOToEntityMapper } from "./mappers/create-category-dto-to-entity.mapper";
import { brand } from "@/lib/brand";
import { Category } from "@/domain/category/category.entity";

export interface UpdateCategoryUsecaseDeps {
  updateCategory: (
    input: EditCategoryInputDTO,
    storeId: string,
  ) => Promise<CategoryDTO>;
}

export const buildUpdateCategoryUsecase = (
  deps: UpdateCategoryUsecaseDeps,
): AuthenticatedUsecaseDefinition<typeof editCategorySchema, CategoryDTO> =>
  authenticatedUsecaseFactory({
    key: "categories.update",
    auth: "required",
    requiredPermissions: [PERMISSIONS.CATEGORIES.UPDATE],
    inputSchema: editCategorySchema,
    execute: async ({ input, authContext }) => {
      return deps.updateCategory(input, authContext.storeId);
    },
  });

export const updateCategoryUsecase = buildUpdateCategoryUsecase({
  updateCategory: async (
    categoryInput: EditCategoryInputDTO,
    storeId: string,
  ) => {
    try {
      const mappedCategory: Category =
        createCategoryDTOToEntityMapper.map({
          ...categoryInput,
          id: brand(categoryInput.id),
        });

      const updatedCategory = await categoryRepositoryAdapter.update(
        mappedCategory,
        brand(storeId),
      );

      return updatedCategory;
    } catch (error) {
      if (error instanceof CategoryNotFoundForStoreError) {
        throw new UseCaseNotFoundError(error.message);
      }

      throw error;
    }
  },
});
