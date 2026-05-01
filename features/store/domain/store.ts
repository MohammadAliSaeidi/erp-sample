import { StoreUser } from "@/features/admin/domain/store-user";
import { addressIdSchema, storeIdSchema } from "@/features/shared/domain/ids";
import { z } from "zod";

export const StoreSlug = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_-]+$/);

export const Store = z.object({
  id: storeIdSchema,
  name: z.string(),
  addressId: addressIdSchema,
  users: z.array(StoreUser),
  slug: StoreSlug,
});

export type Store = z.infer<typeof Store>;
