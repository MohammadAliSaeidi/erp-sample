import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { UseCaseNotFoundError } from "@/src/application/shared/errors/use-case-errors";
import { CategoryId } from "@/src/domain/category/category-id";
import { StoreId } from "@/src/domain/store/store-id";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { categoryRepositoryAdapter } from "@/src/infrastructure/database/adapters/category/category-repository.adapter";
import z from "zod";
import { categoryEntityToDTOMapper } from "./mappers/category-entity-to-dto.mapper";

const getCategoryByIdInputSchema = z.object({
  categoryId: z.uuidv7(),
  storeId: z.uuidv7(),
});

export const buildGetCategoryByIdUsecase = () =>
  authenticatedUsecaseFactory({
    key: "categories.get-by-id",
    auth: "required",
    requiredPermissions: [PERMISSIONS.CATEGORIES.READ_DETAILS],
    inputSchema: getCategoryByIdInputSchema,
    execute: async ({ input, authContext }): Promise<CategoryDTO> => {
      const category = await categoryRepositoryAdapter.getById(
        input.categoryId as CategoryId,
        authContext.storeId as StoreId,
      );

      if (!category) {
        throw new UseCaseNotFoundError(
          `Category ${input.categoryId} was not found`,
        );
      }

      const categoryDTO = categoryEntityToDTOMapper.map(category);

      return categoryDTO;
    },
  });

export const getCategoryByIdUsecase = buildGetCategoryByIdUsecase();
