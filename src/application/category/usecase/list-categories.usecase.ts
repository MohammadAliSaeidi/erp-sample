import { brand } from "@/lib/brand";
import { defineUsecaseWithoutInput } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import type { CategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { StoreId } from "@/src/domain/store/store-id";

export type CategoryOutputDTO = {
  id: string;
  name: string;
  description: string | null;
};

export type ListCategoriesUsecaseDeps = {
  categoryRepository: Pick<CategoryRepositoryPort, "getList">;
};

export const listCategoriesUsecase = defineUsecaseWithoutInput<
  CategoryOutputDTO[],
  StoreAuthContext,
  ListCategoriesUsecaseDeps
>(async (context, deps) => {
  const categories = await deps.categoryRepository.getList(
    brand<string, "StoreId">(context.storeId) as StoreId,
  );

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
  }));
});
