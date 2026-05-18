import { storeSlugSchema } from "@/src/application/store/schema/store-slug.schema";
import z from "zod";
import { usernameSchema } from "@/src/application/admin/schema/username.schema";

export const loginInputSchema = z.object({
  storeSlug: storeSlugSchema,
  username: usernameSchema,
  password: z.string().min(4, "Password must be at least 4 characters"),
});
