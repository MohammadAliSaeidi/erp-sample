import { RoleId, StoreUserId, StoreId } from "@/features/shared/domain/ids";
import z from "zod";

export const StoreUser = z.object({
  id: StoreUserId,
  name: z.string(),
  storeId: StoreId,
  username: z.string().min(4),
  password: z.string().min(8),
  roleId: RoleId,
});

export type StoreUser = z.infer<typeof StoreUser>;