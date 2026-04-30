import z from "zod";
import { createSpecificationSchema } from "../../schema/specification/create-specification.schema";

export type CreateSpecificationInputDTO = z.infer<
  typeof createSpecificationSchema
>;
