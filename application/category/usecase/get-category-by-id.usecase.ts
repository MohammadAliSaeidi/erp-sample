import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { UseCaseNotFoundError } from "@/application/errors/use-case-errors";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";
import z from "zod";
import { CategoryId } from "@/domain/category/category-id";
import { StoreId } from "@/domain/store/store-id";
import { CategoryDTO } from "@/interface/dto/category/category.dto";
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
