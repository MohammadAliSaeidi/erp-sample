import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { specificationRepositoryAdapter } from "../../../infrastructure/database/adapters/specification/specification-repository.adapter";

import { CategoryId } from "@/domain/category/category-id";
import { ISpecificationRepositoryPort } from "@/domain/specification/specification-repository.port";
import { StoreId } from "@/domain/store/store-id";
import z from "zod";
import { SpecificationDTO } from "@/interface/dto/specification/specification.dto";
import { getSpecificationsEntityToDtoMapper } from "./mappers/get-specifications-entity-to-dto.mapper";

export interface GetCategorySpecificationsUsecaseDeps {
  specificationRepository: Pick<ISpecificationRepositoryPort, "getList">;
}

export const buildGetCategorySpecificationsUsecase = (
  deps: GetCategorySpecificationsUsecaseDeps,
) =>
  authenticatedUsecaseFactory({
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
