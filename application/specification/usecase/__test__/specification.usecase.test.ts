import { ISpecificationRepositoryPort } from "@/domain/specification/specification-repository.port";
import { SpecificationValueType } from "@/domain/specification/specification-value-type.enum";
import { buildGetCategorySpecificationsUsecase } from "../get-category-specifications.usecase";

const mockSpecRepoAdapter: Pick<ISpecificationRepositoryPort, "getList"> = {
	getList: async () => {
		return [
			{
				categoryId: "1",
				id: "1",
				isActive: true,
				isPrimary: true,
				isRequired: false,
				name: "color",
				storeId: "1",
				type: SpecificationValueType.STRING,
				specificationValues: [
					{
						id: "1",
						value: "Red",
					},
				],
			},
		];
	},
};

describe("specification usecases", () => {
	it("lists specifications related to a category", async () => {
		const listSpecsUsecase = buildGetCategorySpecificationsUsecase({
			specificationRepository: mockSpecRepoAdapter,
		});

		const specifications = await listSpecsUsecase.execute({
			authContext: {
				adminId: "1",
				exp: 1_000_000_000,
				grantsAll: true,
				iat: 1_000_000_000,
				roleId: "1",
				storeId: "1",
				storeSlug: "hello",
				sub: "sub",
				username: "username",
				permissions: [],
			},
			input: "1",
		});

		expect(specifications).toHaveLength(1);
	});
});
