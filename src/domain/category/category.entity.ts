import { Category as CategoryAggregate } from "./aggregates/category.aggregate";
import { CategoryId } from "./category-id";

/** @deprecated Use `Category.Aggregate` from `./aggregates/category.aggregate` */
export type Category = CategoryAggregate.Aggregate;

export const createCategory = (input: {
  id: CategoryId;
  name: string;
  description?: string;
}): Category =>
  CategoryAggregate.rehydrate({
    id: input.id as CategoryAggregate.Id,
    name: input.name,
    description: input.description ?? null,
  });
