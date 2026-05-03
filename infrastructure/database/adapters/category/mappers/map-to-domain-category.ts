import { Category as PrismaCategory } from "@/app/generated/prisma/client";
import { createCategory, Category as DomainCategory } from "@/domain/category/category.entity";
import { CategoryId } from "@/features/shared/domain/ids";

export const mapToDomainCategory = (
  category: PrismaCategory,
): DomainCategory => {
  return createCategory({
    id: category.id as CategoryId,
    name: category.name,
    description: category.description ?? undefined,
  });
};
