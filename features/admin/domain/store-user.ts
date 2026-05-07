import z from "zod";

export const StoreUser = z.object({
  id: z.uuidv7(),
  name: z.string(),
  storeId: z.uuidv7(),
  username: z.string().min(4),
  password: z.string().min(8),
  roleId: z.uuidv7(),
});

export type StoreUser = z.infer<typeof StoreUser>;
