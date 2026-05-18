import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { UseCaseNotFoundError } from "@/src/application/shared/errors/use-case-errors";
import { ICategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { Category } from "@/src/domain/category/category.entity";
import { CategoryNotFoundForStoreError } from "@/src/domain/category/errors/category-not-found-for-store.error";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import { categoryRepositoryAdapter } from "@/src/infrastructure/database/adapters/category/category-repository.adapter";
import { brand } from "@/lib/brand";
import { editCategorySchema } from "../schema/edit-category.schema";
import { createCategoryDTOToEntityMapper } from "./mappers/create-category-dto-to-entity.mapper";

export interface UpdateCategoryUsecaseDeps {
  categoryRepository: Pick<ICategoryRepositoryPort, "update">;
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
      try {
        const mappedCategory: Category = createCategoryDTOToEntityMapper.map({
          ...input,
          id: brand(input.id),
        });

        const updatedCategory = await deps.categoryRepository.update(
          mappedCategory,
          brand(authContext.storeId),
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

export const updateCategoryUsecase = buildUpdateCategoryUsecase({
  categoryRepository: categoryRepositoryAdapter,
});
