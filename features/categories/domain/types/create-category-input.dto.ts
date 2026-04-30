import z from "zod";
import { createCategorySchema } from "../../../../interface/schema/category/create-category.schema";

export type CreateCategoryInputDTO = z.infer<typeof createCategorySchema>;
