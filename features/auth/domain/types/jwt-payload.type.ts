import z from "zod";
import { storeSlugSchema } from "@/features/store/domain/store";
import { usernameSchema } from "@/application/admin/schema/username.schema";

export const JwtPayload = z.object({
  storeUserId: z.uuidv7(),
  storeId: z.uuidv7(),
  storeSlug: storeSlugSchema,
  username: usernameSchema,
  roleId: z.uuidv7(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayload>;
