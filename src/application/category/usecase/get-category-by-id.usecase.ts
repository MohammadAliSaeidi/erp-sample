import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import { NotFoundError } from "@/src/application/core/errors/application.error";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import type { ICategoryRepositoryPort } from "@/src/domain/category/category-repository.port";
import { StoreId } from "@/src/domain/store/store-id";
import type { CategoryOutputDTO } from "./list-categories.usecase";

export type GetCategoryByIdInputDTO = {
  categoryId: string;
};

export type GetCategoryByIdUsecaseDeps = {
  categoryRepository: Pick<ICategoryRepositoryPort, "getById">;
};

export const getCategoryByIdUsecase = defineUsecase<
  GetCategoryByIdInputDTO,
  CategoryOutputDTO,
  StoreAuthContext,
  GetCategoryByIdUsecaseDeps
>(async (input, context, deps) => {
  const category = await deps.categoryRepository.getById(
    brand<string, "CategoryId">(input.categoryId) as Category.Id,
    brand<string, "StoreId">(context.storeId) as StoreId,
  );

  if (!category) {
    throw new NotFoundError(`Category ${input.categoryId} was not found`);
  }

  return {
    id: category.id,
    name: category.name,
    description: category.description,
  };
});
