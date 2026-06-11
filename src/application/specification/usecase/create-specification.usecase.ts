import { brand } from "@/lib/brand";
import { defineUsecase } from "@/src/application/core/usecase/factories";
import type { StoreAuthContext } from "@/src/application/core/usecase/types/context.types";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";
import { Specification } from "@/src/domain/specification/aggregates/specification.aggregate";
import { SpecificationValueType } from "@/src/domain/specification/specification-value-type.enum";
import type { ISpecificationRepositoryPort } from "@/src/domain/specification/specification-repository.port";
import { CategoryId } from "@/src/domain/category/category-id";
import { StoreId } from "@/src/domain/store/store-id";
import { IdGeneratorPort } from "@/lib/id-generator/id-generator.port";

export type CreateSpecificationInputDTO = {
  name: string;
  categoryId: string;
  type: SpecificationValueType;
  isRequired: boolean;
  isPrimary: boolean;
  specificationValues: ReadonlyArray<{
    value: string | boolean | number;
  }>;
};

export type CreateSpecificationUsecaseDeps = {
  idGenerator: IdGeneratorPort;
  specificationRepository: Pick<ISpecificationRepositoryPort, "create">;
};

export const createSpecificationUsecase = defineUsecase<
  CreateSpecificationInputDTO,
  SpecificationDTO,
  StoreAuthContext,
  CreateSpecificationUsecaseDeps
>(async (input, context, deps) => {
  const specification = Specification.create({
    name: input.name,
    categoryId: brand<string, CategoryId>(input.categoryId) as CategoryId,
    storeId: brand<string, StoreId>(context.storeId) as StoreId,
    type: input.type,
    isRequired: input.isRequired,
    isPrimary: input.isPrimary,
    specificationValues: input.specificationValues,
    generateValueId: () => deps.idGenerator.generate(),
  });

  const created = await deps.specificationRepository.create(specification);

  return {
    id: created.id,
    name: created.name,
    categoryId: created.categoryId,
    storeId: created.storeId,
    type: created.type,
    isRequired: created.isRequired,
    isPrimary: created.isPrimary,
    specificationValues: created.specificationValues,
    isActive: created.isActive,
  };
});
