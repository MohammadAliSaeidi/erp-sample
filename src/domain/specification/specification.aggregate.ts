import { SpecificationValueType } from "./specification-value-type.enum";
import { SpecificationValue } from "./specification-value.entity";

export type Specification = {
  id: string;
  name: string;
  categoryId: string | null;
  storeId: string;
  type: SpecificationValueType;
  isRequired: boolean;
  isPrimary: boolean;
  specificationValues: SpecificationValue[];
  isActive: boolean;
};

export const createSpecification = (input: Specification): Specification => {
  if (input.type === SpecificationValueType.BOOLEAN) {
    input.specificationValues.forEach((specValue) => {
      if (typeof specValue.value !== "boolean")
        throw new Error(
          "All Spec Values must be boolean if the spec type is boolean",
        );
    });
  }

  if (input.type === SpecificationValueType.NUMBER) {
    input.specificationValues.forEach((specValue) => {
      if (typeof specValue.value !== "number")
        throw new Error(
          "All Spec Values mut be number if the spec type is number",
        );
    });
  }

  if (input.type === SpecificationValueType.STRING) {
    input.specificationValues.forEach((specValue) => {
      if (typeof specValue.value !== "string")
        throw new Error(
          "All Spec Values mut be string if the spec type is string",
        );
    });
  }

  return {
    ...input,
    name: input.name.trim(),
    specificationValues: input.specificationValues ?? [],
  };
};
