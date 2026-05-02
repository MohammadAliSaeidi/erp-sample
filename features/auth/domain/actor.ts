import { roleIdSchema, storeUserIdSchema } from "@/features/shared/domain/ids";
import z from "zod";

export const Actor = z.object({
	storeUserId: storeUserIdSchema,
	roleId: roleIdSchema,
});

export type Actor = z.infer<typeof Actor>;
