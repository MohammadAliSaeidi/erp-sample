import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { ICategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { createCategory } from "@/src/domain/category/category.entity";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import { categoryRepositoryAdapter } from "@/src/infrastructure/database/adapters/category/category-repository.adapter";
import { brand } from "@/lib/brand";
import { IdGeneratorPort } from "@/lib/id-generator/id-generator.port";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { createCategorySchema } from "../schema/create-category.schema";
import { createCategoryDTOToEntityMapper } from "./mappers/create-category-dto-to-entity.mapper";

export interface CreateCategoryUsecaseDeps {
  idGenerator: IdGeneratorPort;
  categoryRepository: Pick<ICategoryRepositoryPort, "create">;
}

export const buildCreateCategoryUsecase = (
  deps: CreateCategoryUsecaseDeps,
): AuthenticatedUsecaseDefinition<typeof createCategorySchema, CategoryDTO> =>
  authenticatedUsecaseFactory({
    key: "categories.create",
    auth: "required",
    requiredPermissions: [PERMISSIONS.CATEGORIES.CREATE],
    inputSchema: createCategorySchema,
    execute: async ({ input, authContext }) => {
      const categoryUUID = deps.idGenerator.generate();

      const mappedCategory = createCategoryDTOToEntityMapper.map({
        ...input,
        id: brand(categoryUUID),
      });

      const category = createCategory(mappedCategory);

      const createdCategory = await deps.categoryRepository.create(
        category,
        brand(authContext.storeId),
      );

      const categoryDTO: CategoryDTO = {
        ...createdCategory,
      };

      return categoryDTO;
    },
  });

export const createCategoryUsecase = buildCreateCategoryUsecase({
  idGenerator: uuid7GeneratorAdapter,
  categoryRepository: categoryRepositoryAdapter,
});
