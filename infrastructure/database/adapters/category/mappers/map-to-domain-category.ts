import { Category as PrismaCategory } from "@/app/generated/prisma/client";
import { CategoryId } from "@/domain/category/category-id";
import { createCategory, Category as DomainCategory } from "@/domain/category/category.entity";

export const mapToDomainCategory = (
  category: PrismaCategory,
): DomainCategory => {
  return createCategory({
    id: category.id as CategoryId,
    name: category.name,
    description: category.description ?? undefined,
  });
};
