import z from "zod";

export const editCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});