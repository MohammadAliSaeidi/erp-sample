import { Category as PrismaCategory } from "@/app/generated/prisma/client";
import { Category as DomainCategory } from "@/domain/category/category.entity";

export const mapToDomainCategory = (
  category: PrismaCategory,
): DomainCategory => {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? undefined,
  };
};
