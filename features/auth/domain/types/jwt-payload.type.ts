  import z from "zod";
  import { StoreUserId } from "@/features/admin/domain/StoreUser";
import { StoreId, StoreSlug } from "@/features/store/domain/store";
import { Username } from "@/features/shared/domain/username";
import { RoleId } from "../actor";

export const JwtPayload = z.object({
  storeUserId: StoreUserId,
  storeId: StoreId,
  storeSlug: StoreSlug,
  username: Username,
  roleId: RoleId,
  iat: z.number(),
  exp: z.number(),
})

export type JwtPayload = z.infer<typeof JwtPayload>
