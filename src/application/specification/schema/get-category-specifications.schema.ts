import z from "zod";

export const getCategorySpecificationsSchema = z.object({
  categoryId: z.uuidv7("Invalid category ID"),
});
