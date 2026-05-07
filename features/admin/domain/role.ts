import z from "zod";

export const Role = z.object({
	id: z.uuidv7(),
	name: z.string(),
	storeId: z.uuidv7(),
	grantsAll: z.boolean(),
});

export type Role = z.infer<typeof Role>;
