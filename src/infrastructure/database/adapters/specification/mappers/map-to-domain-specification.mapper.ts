import {
  SpecificationValue as PrismaSpecificationValue,
  SpecificationValueType as PrismaSpecificationValueType,
} from "@/app/generated/prisma/client";
import { Specification } from "@/src/domain/specification/specification.aggregate";
import { mapToDomainType } from "./map-to-domain-type.mapper";
import { SpecificationValue as DomainSpecificationValue } from "@/src/domain/specification/specification-value.entity";

export type PrismaSpecificationWithValues = {
  id: string;
  name: string;
  categoryId: string | null;
  storeId: string;
  type: PrismaSpecificationValueType;
  isPrimary: boolean;
  isRequired: boolean;
  isActive: boolean;
  deletedAt: Date | null;
  updatedAt: Date | null;
  specificationValues: PrismaSpecificationValue[];
};

export const mapToDomainSpecification = (
  prismaSpec: PrismaSpecificationWithValues,
): Specification => {
  const specificationValues: DomainSpecificationValue[] =
    prismaSpec.specificationValues.map((v) => ({
      id: v.id,
      value: v.value as string | boolean | number,
    }));

  const type = mapToDomainType(prismaSpec.type);

  return {
    id: prismaSpec.id,
    name: prismaSpec.name,
    categoryId: prismaSpec.categoryId,
    storeId: prismaSpec.storeId,
    type,
    isRequired: prismaSpec.isRequired,
    isPrimary: prismaSpec.isPrimary,
    isActive: prismaSpec.isActive,
    specificationValues,
  };
};
