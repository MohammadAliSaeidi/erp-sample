import { Category } from "@/app/generated/prisma/client";
import z, { ZodType } from "zod";

export const createCategorySchema = z.object({
	name: z.string().min(1, "Category name is required"),
}) satisfies ZodType<Omit<Category, "id">>;

export const editCategorySchema = z.object({
	name: z.string().min(1, "Category name is required"),
	id: z.string().min(1, "Id is required"),
}) satisfies ZodType<Category>;
