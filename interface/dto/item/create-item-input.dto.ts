import { createItemSchema } from "@/application/item/schema/create-item.schema";
import z from "zod";

export type CreateItemInputDTO = z.infer<typeof createItemSchema>;
