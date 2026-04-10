import { StoreUser } from "@/features/admin/domain/StoreUser"
import { AddressId } from "@/features/shared/domain/address"
import { z } from "zod"

export const StoreId = z.uuidv4().brand("StoreId")  

export const StoreSlug = z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/)

export const Store = z.object({
  id: StoreId,
  name: z.string(),
  addressId: AddressId,
  users: z.array(StoreUser),
  slug: StoreSlug,
})

export type Store = z.infer<typeof Store>;