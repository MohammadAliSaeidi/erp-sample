import {
  SpecificationValue as PrismaSpecificationValue,
  SpecificationValueType as PrismaSpecificationValueType,
} from "@/src/infrastructure/database/orm/prisma/generated/client";
import { Specification } from "@/src/domain/specification/aggregates/specification.aggregate";
import { mapToDomainType } from "./map-to-domain-type.mapper";
import { brand } from "@/lib/brand";

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
): Specification.Aggregate => {
  return Specification.rehydrate({
    id: brand<string, "SpecificationId">(prismaSpec.id) as Specification.Id,
    name: prismaSpec.name,
    categoryId: prismaSpec.categoryId
      ? (brand<string, "CategoryId">(prismaSpec.categoryId) as Specification.Data["categoryId"])
      : null,
    storeId: brand<string, "StoreId">(prismaSpec.storeId) as Specification.Data["storeId"],
    type: mapToDomainType(prismaSpec.type),
    isRequired: prismaSpec.isRequired,
    isPrimary: prismaSpec.isPrimary,
    isActive: prismaSpec.isActive,
    specificationValues: prismaSpec.specificationValues.map((value) => ({
      id: brand<string, "SpecificationValueId">(value.id),
      value: value.value as string | boolean | number,
    })),
  });
};
