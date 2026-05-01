import {
  storeUserIdSchema,
  storeIdSchema,
  roleIdSchema,
} from "@/features/shared/domain/ids";
import z from "zod";

export const StoreUser = z.object({
  id: storeUserIdSchema,
  name: z.string(),
  storeId: storeIdSchema,
  username: z.string().min(4),
  password: z.string().min(8),
  roleId: roleIdSchema,
});

export type StoreUser = z.infer<typeof StoreUser>;
