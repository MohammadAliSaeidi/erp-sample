import { storeSlugSchema } from "@/features/store/domain/store";
import z from "zod";
import { usernameSchema } from "@/interface/schema/username.schema";

export const loginInputSchema = z.object({
  storeSlug: storeSlugSchema,
  username: usernameSchema,
  password: z.string().min(4, "Password must be at least 4 characters"),
});
