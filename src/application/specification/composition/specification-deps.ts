import type { CreateSpecificationUsecaseDeps } from "@/src/application/specification/usecase/create-specification.usecase";
import type { GetCategorySpecificationsUsecaseDeps } from "@/src/application/specification/usecase/get-category-specifications.usecase";
import { specificationRepositoryAdapter } from "@/src/infrastructure/database/adapters/specification/specification-repository.adapter";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";

export const specificationDeps = {
  create: {
    idGenerator: uuid7GeneratorAdapter,
    specificationRepository: specificationRepositoryAdapter,
  } satisfies CreateSpecificationUsecaseDeps,
  listByCategory: {
    specificationRepository: specificationRepositoryAdapter,
  } satisfies GetCategorySpecificationsUsecaseDeps,
};
