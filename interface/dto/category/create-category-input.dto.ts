import z from "zod";
import { createCategorySchema } from "../../../application/category/schema/create-category.schema";

export type CreateCategoryInputDTO = z.infer<typeof createCategorySchema>;
