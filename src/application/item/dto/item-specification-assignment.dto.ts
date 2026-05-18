import { SpecificationValue } from "@/src/domain/specification/specification-value.entity";
import { Specification } from "@/src/domain/specification/specification.aggregate";

export type ItemSpecificationAssignmentDTO = {
  specification: Pick<
    Specification,
    "id" | "isActive" | "isPrimary" | "isRequired" | "name" | "type"
  >;
  specificationValue: SpecificationValue;
};
