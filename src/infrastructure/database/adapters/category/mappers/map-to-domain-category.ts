import { Category as PrismaCategory } from "@/src/infrastructure/database/orm/prisma/generated/client";
import { Category } from "@/src/domain/category/aggregates/category.aggregate";
import { brand } from "@/lib/brand";

export const mapToDomainCategory = (
  category: PrismaCategory,
): Category.Aggregate => {
  return Category.rehydrate({
    id: brand<string, "CategoryId">(category.id) as Category.Id,
    name: category.name,
    description: category.description ?? null,
  });
};
