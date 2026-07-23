import { z } from "zod";

export const getItemByIdSchema = z.object({
  itemId: z.uuidv7(),
});

export type GetItemByIdInput = z.output<typeof getItemByIdSchema>;
