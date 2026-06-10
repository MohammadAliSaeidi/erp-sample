import z from "zod";

export const getCategoryByIdSchema = z.object({
  categoryId: z.uuidv7("Invalid category ID"),
});
