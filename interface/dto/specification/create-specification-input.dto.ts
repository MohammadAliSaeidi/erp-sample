import z from "zod";
import { createSpecificationSchema } from "../../../application/specification/schema/create-specification.schema";

export type CreateSpecificationInputDTO = z.infer<
  typeof createSpecificationSchema
>;
