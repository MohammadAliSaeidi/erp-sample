import { StoreUser } from "@/features/admin/domain/store-user";
import { addressIdSchema, storeIdSchema } from "@/features/shared/domain/ids";
import { z } from "zod";

export const storeSlugSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_-]+$/);

