import { SpecificationValue } from "@/domain/specification/specification-value.entity";
import { Specification } from "@/domain/specification/specification.aggregate";

export type ItemSpecificationAssignmentDTO = {
  specification: Pick<
    Specification,
    "id" | "isActive" | "isPrimary" | "isRequired" | "name" | "type"
  >;
  specificationValue: SpecificationValue;
};
