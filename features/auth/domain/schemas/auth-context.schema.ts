import z from "zod";

export const authContextSchema = z.object({
	adminId: z.string(),
	storeId: z.string(),
	storeSlug: z.string(),
	username: z.string(),
	roleId: z.string(),
	permissions: z.array(z.string()).optional(),
});
