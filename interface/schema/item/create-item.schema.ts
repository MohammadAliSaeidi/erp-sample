import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  number: z.string().min(1, "Item number is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Item price must be greater than 0"),
  categoryId: z.uuidv7().optional(),
  specificationAssignments: z.array(
    z.object({
      specificationId: z.uuidv7(),
      specificationValueId: z.uuidv7(),
    }),
  ),
});
