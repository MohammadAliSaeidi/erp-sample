import z from "zod";
import {
  roleIdSchema,
  storeIdSchema,
  storeUserIdSchema,
} from "@/features/shared/domain/ids";
import { StoreSlug } from "@/features/store/domain/store";
import { Username } from "@/features/shared/domain/username";

export const JwtPayload = z.object({
  storeUserId: storeUserIdSchema,
  storeId: storeIdSchema,
  storeSlug: StoreSlug,
  username: Username,
  roleId: roleIdSchema,
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayload>;
