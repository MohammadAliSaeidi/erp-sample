import z from "zod";
import { StoreUserId, StoreId, RoleId } from "@/features/shared/domain/ids";
import { StoreSlug } from "@/features/store/domain/store";
import { Username } from "@/features/shared/domain/username";

export const JwtPayload = z.object({
  storeUserId: StoreUserId,
  storeId: StoreId,
  storeSlug: StoreSlug,
  username: Username,
  roleId: RoleId,
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayload>;
