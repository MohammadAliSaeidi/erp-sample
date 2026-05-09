import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { CategoryNotFoundForStoreError } from "@/domain/category/errors/category-not-found-for-store.error";
import { UseCaseNotFoundError } from "@/application/errors/use-case-errors";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import { editCategorySchema } from "../schema/edit-category.schema";
import { CategoryDTO } from "@/interface/dto/category/category.dto";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";
import { createCategoryDTOToEntityMapper } from "./mappers/create-category-dto-to-entity.mapper";
import { brand } from "@/lib/brand";
import { Category } from "@/domain/category/category.entity";
import { ICategoryRepositoryPort } from "@/domain/category/category-repository.port";

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
