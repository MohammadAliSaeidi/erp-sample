import { Brand } from "@/lib/brand";
import { z } from "zod";

export type ItemId = Brand<string, "ItemId">;

export const itemIdSchema = z.string().brand("ItemId");