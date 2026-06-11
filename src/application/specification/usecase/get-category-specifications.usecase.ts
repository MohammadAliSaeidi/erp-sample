import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";
import { CategoryId } from "@/src/domain/category/category-id";
import type { ISpecificationRepositoryPort } from "@/src/domain/specification/specification-repository.port";
import { StoreId } from "@/src/domain/store/store-id";

export type GetCategorySpecificationsInputDTO = {
  categoryId: string;
};

export type GetCategorySpecificationsUsecaseDeps = {
  specificationRepository: Pick<ISpecificationRepositoryPort, "getList">;
};

export const getCategorySpecificationsUsecase = defineUsecase<
  GetCategorySpecificationsInputDTO,
  SpecificationDTO[],
  StoreAuthContext,
  GetCategorySpecificationsUsecaseDeps
>(async (input, context, deps) => {
  const specifications = await deps.specificationRepository.getList(
    brand<string, CategoryId>(input.categoryId) as CategoryId,
    brand<string, StoreId>(context.storeId) as StoreId,
  );

  return specifications.map((specification) => ({
    id: specification.id,
    name: specification.name,
    categoryId: specification.categoryId,
    storeId: specification.storeId,
    type: specification.type,
    isRequired: specification.isRequired,
    isPrimary: specification.isPrimary,
    specificationValues: specification.specificationValues,
    isActive: specification.isActive,
  }));
});
