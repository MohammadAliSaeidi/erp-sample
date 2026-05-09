import z from "zod";
import { editCategorySchema } from "../../../application/category/schema/edit-category.schema";

export type EditCategoryInputDTO = z.infer<typeof editCategorySchema>;
