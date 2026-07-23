import { Category } from "./aggregates/category.aggregate";
import { CategoryId } from "./category-id";

export const createCategory = (input: {
  id: CategoryId;
  name: string;
  description?: string;
}): Category.Aggregate =>
  Category.rehydrate({
    id: input.id as Category.Id,
    name: input.name,
    description: input.description ?? null,
  });
