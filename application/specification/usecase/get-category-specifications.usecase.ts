import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { SpecificationDTO } from "../../../interface/dto/specification/specification.dto";
import { specificationRepositoryAdapter } from "../../../infrastructure/database/adapters/specification/specification-repository.adapter";
import {
  CategoryId,
  categoryIdSchema,
  StoreId,
  storeIdSchema,
} from "@/features/shared/domain/ids";
import { BadRequestError } from "@/features/shared/errors/bad-request.error";

export interface GetCategorySpecificationsUsecaseDeps {
  getCategorySpecifications: (
    categoryId: CategoryId,
    storeId: StoreId,
  ) => Promise<SpecificationDTO[]>;
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
      const { success, data: validatedStoreId } = storeIdSchema.safeParse(
        authContext.storeId,
      );

      if (!success) throw new BadRequestError();

      return deps.getCategorySpecifications(categoryId, validatedStoreId);
    },
  });

export const getCategorySpecificationsUsecase = buildGetSpecificationUsecase({
  getCategorySpecifications: async (
    categoryId: CategoryId,
    storeId: StoreId,
  ): Promise<SpecificationDTO[]> => {
    const specifications = await specificationRepositoryAdapter.getList(
      categoryId,
      storeId,
    );

    return specifications;
  },
});
