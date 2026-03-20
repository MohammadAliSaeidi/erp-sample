import { Category } from "@/app/generated/prisma/client";
import z, { ZodType } from "zod";

export const createCategoryBody = z.object({
  name: z.string().min(1, "Category name is required"),
}) satisfies ZodType<Omit<Category, "id" | "storeId">>;
