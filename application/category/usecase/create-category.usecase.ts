import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import {
  AuthenticatedUsecaseDefinition,
  authenticatedUsecaseFactory,
} from "@/features/shared/application/use-case";
import { createCategorySchema } from "../../../interface/schema/category/create-category.schema";
import { CreateCategoryInputDTO } from "../../../interface/dto/category/create-category-input.dto";
import { CategoryDTO } from "@/interface/dto/category/category.dto";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";
import { createCategory } from "@/domain/category/category.entity";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { brand } from "@/lib/brand";
import { createCategoryDTOToEntityMapper } from "./mappers/create-category-dto-to-entity.mapper";

export interface CreateCategoryUsecaseDeps {
  createCategory: (
    categoryInput: CreateCategoryInputDTO,
    storeId: string,
  ) => Promise<CategoryDTO>;
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
      return deps.createCategory(input, authContext.storeId);
    },
  });

export const createCategoryUsecase = buildCreateCategoryUsecase({
  createCategory: async (
    categoryInput: CreateCategoryInputDTO,
    storeId: string,
  ) => {
    const categoryUUID = uuid7GeneratorAdapter.generate();

    const mappedCategory = createCategoryDTOToEntityMapper.map({
      ...categoryInput,
      id: brand(categoryUUID),
    });

    const category = createCategory(mappedCategory);

    const createdCategory = await categoryRepositoryAdapter.create(
      category,
      brand(storeId),
    );

    const categoryDTO: CategoryDTO = {
      ...createdCategory,
    };

    return categoryDTO;
  },
});
