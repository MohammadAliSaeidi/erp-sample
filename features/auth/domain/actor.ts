import { RoleId, StoreUserId } from "@/features/shared/domain/ids";
import z from "zod";

export const Actor = z.object({
	storeUserId: StoreUserId,
	roleId: RoleId,
});

export type Actor = z.infer<typeof Actor>;
