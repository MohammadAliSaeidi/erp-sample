import z from "zod";
import { StoreUserId } from "@/features/admin/domain/StoreUser";

export const RoleId = z.uuidv4().brand("RoleId");

export const Actor = z.object({
	storeUserId: StoreUserId,
  roleId: RoleId,
});

export type Actor = z.infer<typeof Actor>;
