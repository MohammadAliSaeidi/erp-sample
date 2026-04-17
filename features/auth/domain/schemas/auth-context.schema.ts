import z from "zod";

export const adminAuthContextSchema = z.object({
	adminId: z.string(),
	storeId: z.string(),
	storeSlug: z.string(),
	username: z.string(),
	roleId: z.string(),
	grantsAll: z.boolean(),
	permissions: z.array(z.string()).optional(),
	sub: z.string(),
	exp: z.number(),
	iat: z.number(),
});
