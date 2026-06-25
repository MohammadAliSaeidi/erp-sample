import { Specification as SpecificationAggregate } from "./aggregates/specification.aggregate";

/** @deprecated Use `Specification.Aggregate` from `./aggregates/specification.aggregate` */
export type Specification = SpecificationAggregate.Aggregate;

export const createSpecification = (input: {
  id: string;
  name: string;
  categoryId: string | null;
  storeId: string;
  type: SpecificationAggregate.Data["type"];
  isRequired: boolean;
  isPrimary: boolean;
  specificationValues: SpecificationAggregate.SpecificationValueData[];
  isActive: boolean;
}): Specification =>
  SpecificationAggregate.rehydrate({
    id: input.id as SpecificationAggregate.Id,
    name: input.name,
    categoryId: input.categoryId as SpecificationAggregate.Data["categoryId"],
    storeId: input.storeId as SpecificationAggregate.Data["storeId"],
    type: input.type,
    isRequired: input.isRequired,
    isPrimary: input.isPrimary,
    specificationValues: input.specificationValues,
    isActive: input.isActive,
  });
