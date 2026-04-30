import { SpecificationValueType as DomainSpecificationValueType } from "@/features/specifications/domain/specification/specification-value-type.enum";
import { SpecificationValueType as PrismaSpecificationValueType } from "@/app/generated/prisma/client";

export const mapToPrismaType = (
  type: DomainSpecificationValueType,
): PrismaSpecificationValueType => {
  const typeMap = {
    [DomainSpecificationValueType.BOOLEAN]: "BOOLEAN",
    [DomainSpecificationValueType.NUMBER]: "NUMBER",
    [DomainSpecificationValueType.STRING]: "STRING",
  } as const;

  return typeMap[type];
};

export const mapToDomainType = (
  type: PrismaSpecificationValueType,
): DomainSpecificationValueType => {
  const typeMap = {
    BOOLEAN: DomainSpecificationValueType.BOOLEAN,
    NUMBER: DomainSpecificationValueType.NUMBER,
    STRING: DomainSpecificationValueType.STRING,
  } as const;

  return typeMap[type];
};