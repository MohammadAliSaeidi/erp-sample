import { CategoryDTO } from "@/src/application/category/dto/category.dto";
import { ICategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { StoreId } from "@/src/domain/store/store-id";
import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { buildAuthenticatedUsecase } from "@/features/shared/application/use-case";
import { categoryRepositoryAdapter } from "@/src/infrastructure/database/adapters/category/category-repository.adapter";
import z from "zod";

const listCategoriesInputSchema = z.object({});

export interface ListCategoriesUsecaseDeps {
  categoryRepository: Pick<ICategoryRepositoryPort, "getList">;
}

export const buildListCategoriesUsecase = (deps: ListCategoriesUsecaseDeps) =>
  buildAuthenticatedUsecase({
    key: "categories.list",
    auth: "required",
    requiredPermissions: [PERMISSIONS.CATEGORIES.READ],
    inputSchema: listCategoriesInputSchema,
    execute: async ({ authContext }): Promise<CategoryDTO[]> => {
      const categories = await deps.categoryRepository.getList(
        authContext.storeId as StoreId,
      );

      return categories.map((category) => ({
        ...category,
      }));
    },
  });

export const listCategoriesUsecase = buildListCategoriesUsecase({
  categoryRepository: categoryRepositoryAdapter,
});
