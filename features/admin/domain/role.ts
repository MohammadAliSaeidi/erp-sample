import { RoleId, StoreId } from "@/features/shared/domain/ids";
import z from "zod";

export const Role = z.object({
	id: RoleId,
	name: z.string,
	storeId: StoreId,
	grantsAll: z.boolean(),
});

export type Role = z.infer<typeof Role>;
