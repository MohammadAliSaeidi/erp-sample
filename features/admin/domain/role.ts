import { roleIdSchema, storeIdSchema } from "@/features/shared/domain/ids";
import z from "zod";

export const Role = z.object({
	id: roleIdSchema,
	name: z.string(),
	storeId: storeIdSchema,
	grantsAll: z.boolean(),
});

export type Role = z.infer<typeof Role>;
