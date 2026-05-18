import z from "zod";
import { createSpecificationSchema } from "../schema/create-specification.schema";

export type CreateSpecificationInputDTO = z.infer<
  typeof createSpecificationSchema
>;
