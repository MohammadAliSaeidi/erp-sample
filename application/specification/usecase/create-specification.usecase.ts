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
import { createSpecificationSchema } from "../schema/create-specification.schema";
import { IdGeneratorPort } from "@/lib/id-generator/id-generator.port";
import { ISpecificationRepositoryPort } from "@/domain/specification/specification-repository.port";

export interface CreateSpecificationUsecaseDeps {
	idGenerator: IdGeneratorPort;
	specificationRepository: Pick<ISpecificationRepositoryPort, 'create'>;
}

export const buildCreateSpecificationUsecase = (
	deps: CreateSpecificationUsecaseDeps
) =>
	authenticatedUsecaseFactory({
		key: "specifications.create",
		auth: "required",
		requiredPermissions: [PERMISSIONS.SPECIFICATION.CREATE],
		inputSchema: createSpecificationSchema,
		execute: async ({ input, authContext: { storeId } }) => {
			const generatedUUID = deps.idGenerator.generate();

			const values: SpecificationValue[] =
				input.specificationValues.map((specValueInput) => {
					const id = uuid7GeneratorAdapter.generate();
					const specificationValue = createSpecificationValue({
						id: id,
						value: specValueInput.value,
					});

					return specificationValue;
				});

			const createSpecificationInput = createSpecification({
				...input,
				id: generatedUUID,
				specificationValues: values,
				isActive: true,
				storeId: storeId,
			});

			const specification = await deps.specificationRepository.create(
				createSpecificationInput
			);

			const specificationDTO: SpecificationDTO = {
				...specification,
			};

			return specificationDTO;
		},
	});

export const createSpecificationUsecase = buildCreateSpecificationUsecase({
	idGenerator: uuid7GeneratorAdapter,
	specificationRepository: specificationRepositoryAdapter,
});
