import { PERMISSIONS } from "@/features/auth/domain/constants/permissions";
import { authenticatedUsecaseFactory } from "@/features/shared/application/use-case";
import { CreateSpecificationInputDTO } from "../../../interface/dto/specification/create-specification-input.dto";
import { SpecificationDTO } from "../../../interface/dto/specification/specification.dto";
import { uuid7GeneratorAdapter } from "@/lib/id-generator/uuid-generator.adapter";
import { createSpecification } from "../../../domain/specification/specification.aggregate";
import {
  createSpecificationValue,
  SpecificationValue,
} from "../../../domain/specification/specification-value.entity";
import { specificationRepositoryAdapter } from "../../../infrastructure/database/adapters/specification/specification-repository.adapter";
import { createSpecificationSchema } from "../../../interface/schema/specification/create-specification.schema";

export interface CreateSpecificationUsecaseDeps {
  createSpecification: (
    input: CreateSpecificationInputDTO,
    storeId: string,
  ) => Promise<SpecificationDTO>;
}

export const buildCreateSpecificationUsecase = (
  deps: CreateSpecificationUsecaseDeps,
) =>
  authenticatedUsecaseFactory({
    key: "specifications.create",
    auth: "required",
    requiredPermissions: [PERMISSIONS.SPECIFICATION.CREATE],
    inputSchema: createSpecificationSchema,
    execute: async ({ input, authContext }) => {
      return deps.createSpecification(input, authContext.storeId);
    },
  });

export const createSpecificationUsecase = buildCreateSpecificationUsecase({
  createSpecification: async (
    input: CreateSpecificationInputDTO,
  ): Promise<SpecificationDTO> => {
    const generatedUUID = uuid7GeneratorAdapter.generate();

    const values: SpecificationValue[] = input.specificationValues.map(
      (specValueInput) => {
        const id = uuid7GeneratorAdapter.generate();
        const specificationValue = createSpecificationValue({
          id: id,
          value: specValueInput.value,
        });

        return specificationValue;
      },
    );

    const createSpecificationInput = createSpecification({
      ...input,
      id: generatedUUID,
      specificationValues: values,
      isActive: true,
    });

    const specification = await specificationRepositoryAdapter.create(
      createSpecificationInput,
      createSpecificationInput.storeId,
    );

    const specificationDTO: SpecificationDTO = {
      ...specification,
    };

    return specificationDTO;
  },
});
