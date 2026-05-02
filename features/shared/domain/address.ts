import z from "zod";
import { addressIdSchema } from "./ids";

export const Address = z.object({
	id: addressIdSchema,
	street: z.string(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string(),
});
