import { createItemSchema } from "@/interface/schema/item/create-item.schema";
import z from "zod";

export type CreateItemInputDTO = z.infer<typeof createItemSchema>;
