import z from "zod";
import { editCategorySchema } from "../../schema/category/edit-category.schema";

export type EditCategoryInputDTO = z.infer<typeof editCategorySchema>;
