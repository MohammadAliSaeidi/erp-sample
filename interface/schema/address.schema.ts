import z from "zod";
import { addressIdSchema } from "../../features/shared/domain/ids";

export const Address = z.object({
	id: addressIdSchema,
	street: z.string(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string(),
});
