import { RoleId } from "@/features/auth/domain/actor";
import { StoreId } from "@/features/store/domain/store";
import z from "zod";

export const StoreUserId = z.uuidv4().brand("StoreUserId");

export const StoreUser = z.object({
  id: StoreUserId,
  name: z.string(),
  storeId: StoreId,
  username: z.string().min(4),
  password: z.string().min(8),
  roleId: RoleId,
});

export type StoreUser = z.infer<typeof StoreUser>;