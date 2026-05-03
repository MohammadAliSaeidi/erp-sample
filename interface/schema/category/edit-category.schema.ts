import z from "zod";

export const editCategorySchema = z.object({
  id: z.uuidv7("Invalid category ID"),
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});