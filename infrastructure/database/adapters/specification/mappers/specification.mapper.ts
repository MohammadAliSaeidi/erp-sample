import {
  SpecificationValueType as DomainSpecificationValueType,
} from "@/domain/specification/specification-value-type.enum";
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

