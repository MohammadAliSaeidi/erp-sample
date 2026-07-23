import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import { NotFoundError } from "@/src/application/core/errors/application.error";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import { CategoryNotFoundForStoreError } from "@/src/domain/category/errors/category-not-found-for-store.error";
import type { CategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { StoreId } from "@/src/domain/store/store-id";
import type { CategoryOutputDTO } from "./list-categories.usecase";

export type UpdateCategoryInputDTO = {
  id: string;
  name: string;
  description?: string;
};

export type UpdateCategoryUsecaseDeps = {
  categoryRepository: Pick<CategoryRepositoryPort, "update">;
};

export const updateCategoryUsecase = defineUsecase<
  UpdateCategoryInputDTO,
  CategoryOutputDTO,
  StoreAuthContext,
  UpdateCategoryUsecaseDeps
>(async (input, context, deps) => {
  const category = Category.update({
    id: brand<string, "CategoryId">(input.id) as Category.Id,
    name: input.name,
    description: input.description ?? null,
  });

  try {
    const updated = await deps.categoryRepository.update(
      category,
      brand<string, "StoreId">(context.storeId) as StoreId,
    );

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
    };
  } catch (error) {
    if (error instanceof CategoryNotFoundForStoreError) {
      throw new NotFoundError(error.message);
    }

    throw error;
  }
});
