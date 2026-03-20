import z from "zod";
import { createCategoryBody } from "../schemas/create-category-body.schema";

export type CreateCategoryBody = z.infer<typeof createCategoryBody>;
