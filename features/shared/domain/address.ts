import z from "zod";
import { AddressId } from "./ids";

export const Address = z.object({
	id: AddressId,
	street: z.string(),
	city: z.string(),
	state: z.string(),
	zipCode: z.string(),
});
