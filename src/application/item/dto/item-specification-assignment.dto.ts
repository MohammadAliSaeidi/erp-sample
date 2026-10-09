import { Specification } from "@/src/domain/specification/aggregates/specification.aggregate";
import { SpecificationValue } from "@/src/domain/specification/specification-value.entity";

export type ItemSpecificationAssignmentDTO = {
	specification: Pick<
		Specification.Aggregate,
		"isActive" | "isPrimary" | "isRequired" | "name" | "type" | "id"
	>;
	specificationValue: SpecificationValue;
};
