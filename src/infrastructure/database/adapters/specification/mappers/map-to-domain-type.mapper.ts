import { SpecificationValueType as DomainSpecificationValueType } from "@/src/domain/specification/specification-value-type.enum";
import { SpecificationValueType as PrismaSpecificationValueType } from "@/app/generated/prisma/client";

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
