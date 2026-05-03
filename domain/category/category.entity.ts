import { CategoryId } from "./category-id";

export type Category = {
  id: CategoryId;
  name: string;
  description?: string;
};

export const createCategory = (input: Category): Category => {
  if (input.name.trim().length === 0)
    throw new Error("Category name is required");

  return {
    ...input,
    name: input.name.trim(),
  };
};
