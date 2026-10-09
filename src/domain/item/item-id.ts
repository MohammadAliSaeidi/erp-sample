import { Item } from "./aggregates/item.aggregate";
import { z } from "zod";

export type ItemId = Item.Id;
export const itemIdSchema = z.string();
