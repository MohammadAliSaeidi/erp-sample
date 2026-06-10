import type { CreateCategoryUsecaseDeps } from "@/src/application/category/usecase/create-category.usecase";
import type { GetCategoryByIdUsecaseDeps } from "@/src/application/category/usecase/get-category-by-id.usecase";
import type { ListCategoriesUsecaseDeps } from "@/src/application/category/usecase/list-categories.usecase";
import type { UpdateCategoryUsecaseDeps } from "@/src/application/category/usecase/update-category.usecase";
import { categoryRepositoryAdapter } from "@/src/infrastructure/database/adapters/category/category-repository.adapter";

export const categoryDeps = {
  create: {
    categoryRepository: categoryRepositoryAdapter,
  } satisfies CreateCategoryUsecaseDeps,
  list: {
    categoryRepository: categoryRepositoryAdapter,
  } satisfies ListCategoriesUsecaseDeps,
  getById: {
    categoryRepository: categoryRepositoryAdapter,
  } satisfies GetCategoryByIdUsecaseDeps,
  update: {
    categoryRepository: categoryRepositoryAdapter,
  } satisfies UpdateCategoryUsecaseDeps,
};
