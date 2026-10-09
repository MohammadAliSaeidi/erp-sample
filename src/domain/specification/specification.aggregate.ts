import { Specification } from "./aggregates/specification.aggregate";

export const createSpecification = (input: {
	id: string;
	name: string;
	categoryId: string | null;
	storeId: string;
	type: Specification.Data["type"];
	isRequired: boolean;
	isPrimary: boolean;
	specificationValues: Specification.SpecificationValueData[];
	isActive: boolean;
}): Specification.Aggregate =>
	Specification.rehydrate({
		id: input.id as Specification.Id,
		name: input.name,
		categoryId: input.categoryId as Specification.Data["categoryId"],
		storeId: input.storeId as Specification.Data["storeId"],
		type: input.type,
		isRequired: input.isRequired,
		isPrimary: input.isPrimary,
		specificationValues: input.specificationValues,
		isActive: input.isActive,
	});
