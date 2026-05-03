import z from "zod";
import {
  roleIdSchema,
  storeIdSchema,
  storeUserIdSchema,
} from "@/features/shared/domain/ids";
import { storeSlugSchema } from "@/features/store/domain/store";
import { usernameSchema } from "@/interface/schema/username.schema";

export const JwtPayload = z.object({
  storeUserId: storeUserIdSchema,
  storeId: storeIdSchema,
  storeSlug: storeSlugSchema,
  username: usernameSchema,
  roleId: roleIdSchema,
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayload>;
