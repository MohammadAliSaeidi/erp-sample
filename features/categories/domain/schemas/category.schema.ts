import { CategoryId, StoreId } from "@/features/shared/domain/ids";
import z from "zod";

export const Category = z.object({
	id: CategoryId,
	storeId: StoreId,
	name: z.string(),
	description: z.string().optional(),
});
