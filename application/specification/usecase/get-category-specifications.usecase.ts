import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { SpecificationDTO } from "../../../interface/dto/specification/specification.dto";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { createSpecification } from "../../../domain/specification/specification.aggregate";
import {
  createSpecificationValue,
  SpecificationValue,
} from "../../../domain/specification/specification-value.entity";
import { specificationRepositoryAdapter } from "../../../infrastructure/database/adapters/specification/specification-repository.adapter";
import { categoryId, categoryIdSchema } from "@/features/shared/domain/ids";

export interface GetCategorySpecificationsUsecaseDeps {
  getCategorySpecifications: (
    categoryId: categoryId,
    storeId: string,
  ) => Promise<SpecificationDTO>;
}

export const buildGetSpecificationUsecase = (
  deps: GetCategorySpecificationsUsecaseDeps,
) =>
  authenticatedUsecaseFactory({
    key: "specifications.create",
    auth: "required",
    requiredPermissions: [PERMISSIONS.SPECIFICATION.CREATE],
    inputSchema: categoryIdSchema,
    execute: async ({ input: categoryId, authContext }) => {
      return deps.getCategorySpecifications(categoryId, authContext.storeId);
    },
  });

export const createSpecificationUsecase = buildGetSpecificationUsecase({
  getCategorySpecifications: async (
    categoryId: categoryId,
  ): Promise<SpecificationDTO> => {

    const specification = await specificationRepositoryAdapter.getList(
      createSpecificationInput,
      createSpecificationInput.storeId,
    );

    const specificationDTO: SpecificationDTO = {
      ...specification,
    };

    return specificationDTO;
  },
});
