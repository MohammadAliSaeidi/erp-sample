import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import type { CategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { StoreId } from "@/src/domain/store/store-id";
import type { CategoryOutputDTO } from "./list-categories.usecase";

export type CreateCategoryInputDTO = {
  name: string;
  description?: string;
};

export type CreateCategoryOutputDTO = CategoryOutputDTO;

export type CreateCategoryUsecaseDeps = {
  categoryRepository: Pick<CategoryRepositoryPort, "create">;
};

export const createCategoryUsecase = defineUsecase<
  CreateCategoryInputDTO,
  CreateCategoryOutputDTO,
  StoreAuthContext,
  CreateCategoryUsecaseDeps
>(async (input, context, deps) => {
  const category = Category.create({
    name: input.name,
    description: input.description ?? null,
  });

  const created = await deps.categoryRepository.create(
    category,
    brand<string, "StoreId">(context.storeId) as StoreId,
  );

  return {
    id: created.id,
    name: created.name,
    description: created.description,
  };
});
