import { StoreSlug } from "@/features/store/domain/store";
import { Username } from "@/features/shared/domain/username";
import z from "zod";

export const loginInputSchema = z.object({
  storeSlug: StoreSlug,
  username: Username,
  password: z.string().min(4, "Password must be at least 4 characters"),
});
