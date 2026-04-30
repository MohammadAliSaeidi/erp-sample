import z from "zod";
import { createCategorySchema } from "../../schema/category/create-category.schema";

export type CreateCategoryInputDTO = z.infer<typeof createCategorySchema>;
