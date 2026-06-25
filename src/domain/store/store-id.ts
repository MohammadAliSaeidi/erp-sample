import { Brand } from "@/lib/brand";
import { z } from "zod";

export const STORE_ID_TAG = "StoreId" as const

export type StoreId = Brand<string, typeof STORE_ID_TAG>;

export const storeIdSchema = z.string().brand(STORE_ID_TAG);