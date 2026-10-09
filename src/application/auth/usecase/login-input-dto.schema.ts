import { usernameSchema } from "@/src/application/admin/schema/username.schema";
import { storeSlugSchema } from "@/src/application/store/schema/store-slug.schema";
import z from "zod";

export const loginInputDTOSchema = z.object({
	storeSlug: storeSlugSchema,
	username: usernameSchema,
	password: z.string().min(4, "Password must be at least 4 characters"),
});
