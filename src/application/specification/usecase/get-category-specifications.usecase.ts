import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { buildAuthenticatedUsecase } from "@/features/shared/application/use-case";
import { specificationRepositoryAdapter } from "@/src/infrastructure/database/adapters/specification/specification-repository.adapter";

import { CategoryId } from "@/src/domain/category/category-id";
import { ISpecificationRepositoryPort } from "@/src/domain/specification/specification-repository.port";
import { StoreId } from "@/src/domain/store/store-id";
import z from "zod";
import { SpecificationDTO } from "@/src/application/specification/dto/specification.dto";
import { getSpecificationsEntityToDtoMapper } from "./mappers/get-specifications-entity-to-dto.mapper";

export interface GetCategorySpecificationsUsecaseDeps {
  specificationRepository: Pick<ISpecificationRepositoryPort, "getList">;
}

export const buildGetCategorySpecificationsUsecase = (
  deps: GetCategorySpecificationsUsecaseDeps,
) =>
  buildAuthenticatedUsecase({
    key: "category-specifications.get-list",
    auth: "required",
    requiredPermissions: [PERMISSIONS.SPECIFICATION.READ],
    inputSchema: z.uuid(),
    execute: async ({ input: categoryId, authContext: { storeId } }) => {
      const specifications = await deps.specificationRepository.getList(
        categoryId as CategoryId,
        storeId as StoreId,
      );

      const specificationDTOs: SpecificationDTO[] = specifications.map(
        (specification) =>
          getSpecificationsEntityToDtoMapper.map(specification),
      );

      return specificationDTOs;
    },
  });

export const getCategorySpecificationsUsecase =
  buildGetCategorySpecificationsUsecase({
    specificationRepository: specificationRepositoryAdapter,
  });
