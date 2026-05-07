import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import z from "zod";
import { StoreId } from "@/domain/store/store-id";
import { categoryRepositoryAdapter } from "@/infrastructure/database/adapters/category/category-repository.adapter";
import { ICategoryRepositoryPort } from "@/domain/category/category-repository.port";
import { CategoryDTO } from "@/interface/dto/category/category.dto";

const listCategoriesInputSchema = z.object({});

export interface ListCategoriesUsecaseDeps {
  categoryRepository: Pick<ICategoryRepositoryPort, "getList">;
}

export const buildListCategoriesUsecase = (deps: ListCategoriesUsecaseDeps) =>
  authenticatedUsecaseFactory({
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
