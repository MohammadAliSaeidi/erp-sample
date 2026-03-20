import { Category } from "@/app/generated/prisma/client";
import z, { ZodType } from "zod";

export const editCategoryBody = z.object({
  id: z.string(),
  name: z.string(),
}) satisfies ZodType<Omit<Category, "storeId">>;

export type EditCategoryBody = z.infer<typeof editCategoryBody>;
